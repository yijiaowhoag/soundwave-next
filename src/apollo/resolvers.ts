import { db } from '../services/firebase';

const trackReducer = (track) => {
  return {
    id: track.id,
    name: track.name,
    artists:
      track.artists && track.artists.length > 0
        ? track.artists.reduce(
            (acc, artist) => [...acc, artistReducer(artist)],
            []
          )
        : [],
    images: track.album.images.map((image) => ({
      width: image.width,
      height: image.height,
      url: image.url,
    })),
    duration_ms: track.duration_ms,
    uri: track.uri,
  };
};

const artistReducer = (artist) => {
  return {
    id: artist.id,
    name: artist.name,
    genres: artist.genres,
    images: artist.images,
    uri: artist.uri,
  };
};

export const resolvers = {
  Query: {
    search: async (_, { query }: { query: string }, { dataSources }) => {
      const response = await dataSources.spotifyAPI.searchTracks(query);

      return Array.isArray(response.tracks.items)
        ? response.tracks.items.map(trackReducer)
        : [];
    },

    userTopTracks: async (
      _,
      { offset, limit }: { offset: number; limit: number },
      { dataSources }
    ) => {
      const response = await dataSources.spotifyAPI.getUserTopTracks(
        offset,
        limit
      );
      const items = Array.isArray(response.items)
        ? response.items.map(trackReducer)
        : [];

      return items;
    },

    userTopArtists: async (
      _,
      { offset, limit }: { offset: number; limit: number },
      { dataSources }
    ) => {
      const response = await dataSources.spotifyAPI.getUserTopArtists(
        offset,
        limit
      );
      const items = Array.isArray(response.items)
        ? response.items.map(artistReducer)
        : [];

      return items;
    },

    sessions: async (_, __, context) => {
      const userDoc = await db
        .collection('users')
        .doc(context.authSession.id)
        .get();

      return userDoc.data()?.sessions;
    },

    session: async (_, { sessionId }: { sessionId: string }) => {
      const sessionDoc = await db.collection('sessions').doc(sessionId).get();

      const queue = await db
        .collection('sessions')
        .doc(sessionId)
        .collection('queue')
        .orderBy('timestamp', 'desc')
        .get();

      const trackIds: string[] = [];

      const list = queue
        ? queue.docs.map((doc) => {
            trackIds.push(doc.data().id);

      return {
              ...doc.data(),
              id: doc.id,
              timestamp: doc.data().timestamp.toString(),
      };
          })
        : [];

      return { id: sessionDoc.id, ...sessionDoc.data(), queue: list, trackIds };
    },
  },

  Mutation: {
    createSession: async (
      _,
      { sessionName }: { sessionName: string },
      context
    ) => {
      try {
        const sessionRef = await db.collection('sessions').add({
          name: sessionName,
          users: [{ id: context.authSession.id }],
        });
        const sessionDoc = await sessionRef.get();
        const userRef = db.collection('users').doc(context.authSession.id);

        db.runTransaction(async (transaction) => {
          let userDoc;
          try {
            userDoc = await transaction.get(userRef);
            const sessions = userDoc.data()?.sessions ?? [];

            transaction.update(userRef, {
              sessions: [
                { id: sessionRef.id, ...sessionDoc.data() },
                ...sessions,
              ],
            });
          } catch (err) {
            throw new Error(err);
          }
        });

        return;
      } catch (err) {
        throw new Error(err);
      }
    },

    addToSession: async (_, { sessionId, track }) => {
      try {
        const timestamp = Date.now();

        await db
          .collection('sessions')
          .doc(sessionId)
          .collection('queue')
          .doc(`${timestamp}:${track.id}`)
          .set({ ...track, timestamp });

        return {
          code: 201,
          success: true,
          track: {
            ...track,
            id: `${timestamp}:${track.id}`,
            timestamp,
          },
        };
      } catch (err) {
        throw new Error(err);
      }
    },

    removeFromSession: async (_, { sessionId, track }) => {
      try {
        await db
          .collection('sessions')
          .doc(sessionId)
          .collection('queue')
          .doc(track.id)
          .delete();

        return { code: 204, success: true, track };
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Session: {
    id: (parent) => parent.id,
    name: (parent) => parent.name,
    queue: async (parent) => parent.queue,
    audioFeatures: async (parent, __, { dataSources }) => {
      const { audio_features } = await dataSources.spotifyAPI.getAudioFeatures(
        parent.trackIds
      );

      return audio_features;
    },
  },
};
