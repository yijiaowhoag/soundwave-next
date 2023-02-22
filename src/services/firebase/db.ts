import { admin } from './init';
import { User } from '../../apollo/entities/User';
import { Session } from '../../apollo/entities/Session';
import { TrackInQueue, AddTrackInput } from '../../apollo/entities/Track';
import { SeedInput } from '../../apollo/resolvers/search';
import type { SpotifyUser } from '../../types';

const firestore = admin.firestore();
firestore.settings({ ignoreUndefinedProperties: true });

const converter = <T>() => ({
  toFirestore: (data: T): FirebaseFirestore.DocumentData => data,
  fromFirestore: (snapshot: FirebaseFirestore.QueryDocumentSnapshot): T =>
    ({ id: snapshot.id, ...snapshot.data() } as T),
});

const collectionDataPoint = <T>(collectionPath: string) => {
  const collectionRef = firestore
    .collection(collectionPath)
    .withConverter(converter<T>());

  return {
    add: async (data: T) => collectionRef.add(data),
    get: async () => collectionRef.get(),
    collectionRef,
  };
};

const docDataPoint = <T>(docPath: string) => {
  const docRef = firestore.doc(docPath).withConverter(converter<T>());

  return {
    get: async () => docRef.get(),
    set: async (data: T, options?: FirebaseFirestore.SetOptions) =>
      docRef.set(data, options),
    update: async (data: FirebaseFirestore.UpdateData<T>) =>
      docRef.update(data),
    delete: async () => docRef.delete(),
    docRef,
  };
};

const getUser = async (userId: string) => {
  return (await docDataPoint<User>(`users/${userId}`).get()).data();
};

const createUser = async (data: SpotifyUser) => {
  const userRef = docDataPoint<User>(`users/${data.id}`);
  await userRef.set(
    { ...data, avatar: data.images[0].url, searches: [] },
    { merge: true }
  );

  return (await userRef.get()).data();
};

const updateUser = async (userId: string, data) => {
  return await docDataPoint<User>(`/users/${userId}`).update(
    Object.assign({}, data)
  );
};

const getUserSessions = async (userId: string) => {
  const querySnapshot = await collectionDataPoint<Session>('sessions')
    .collectionRef.where('creatorId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();

  return querySnapshot.docs.map((doc) => doc.data());
};

const getSessionById = async (sessionId: string) => {
  const session = (
    await docDataPoint<Session>(`sessions/${sessionId}`).get()
  ).data();
  const queue = (
    await collectionDataPoint<TrackInQueue>(`sessions/${sessionId}/queue`).get()
  ).docs.map((doc) => doc.data());

  return { ...session, queue };
};

const createSession = async (data) => {
  const sessionRef = await collectionDataPoint<Session>('sessions').add({
    ...data,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return await docDataPoint<User>(
    `sessions/${sessionRef.id}/members/${data.creatorId}`
  );
};

const updateSession = async (sessionId: string, data) => {
  return await docDataPoint<Session>(`sessions/${sessionId}`).update(
    Object.assign({}, data)
  );
};

const deleteSession = async (sessionId: string) =>
  docDataPoint<Session>(`sessions/${sessionId}`).delete();

const addTrackToSession = async (sessionId: string, track: AddTrackInput) => {
  const timestamp = Date.now().toString();
  const trackRef = docDataPoint<TrackInQueue>(
    `sessions/${sessionId}/queue/${timestamp}:${track.id}`
  );
  await trackRef.set({ ...JSON.parse(JSON.stringify(track)), timestamp });

  return (await trackRef.get()).data();
};

const removeTrackFromSession = async (sessionId: string, trackId: string) => {
  return await docDataPoint(`sessions/${sessionId}/queue/${trackId}`).delete();
};

const addRecentSearch = async (userId: string, search: SeedInput) => {
  const timestamp = admin.firestore.FieldValue.serverTimestamp();

  return await docDataPoint<User>(`users/${userId}`).update({
    searches: admin.firestore.FieldValue.arrayUnion({
      ...search,
      timestamp: new Date(Date.now()),
    }),
  });
};

const removeRecentSearch = async (userId: string, searchId: string) => {
  const userRef = docDataPoint<User>(`users/${userId}`);
  const { searches } = (await userRef.get()).data();
  const removed = searches.find((search) => search.id === searchId);

  return await userRef.update({
    searches: admin.firestore.FieldValue.arrayRemove(removed),
  });
};

const clearSearchHistory = async (userId: string) => {
  return await docDataPoint<User>(`users/${userId}`).update({
    searches: [],
  });
};

const db = {
  getUser,
  createUser,
  updateUser,
  getUserSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  addTrackToSession,
  removeTrackFromSession,
  addRecentSearch,
  removeRecentSearch,
  clearSearchHistory,
};

export { db };
