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
  },
};
