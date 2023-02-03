import * as admin from 'firebase-admin';
import { User } from '../apollo/entities/User';
import { Session } from '../apollo/entities/Session';
import {
  TrackInQueue,
  AddTrackInput,
  RemoveTrackInput,
} from '../apollo/entities/Track';
import type { SpotifyUser } from '../types';

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

const firestore = admin.firestore();

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
    delete: async () => docRef.delete(),
    docRef,
  };
};

const getUser = async (userId: string) => {
  return (await docDataPoint<User>(`users/${userId}`).get()).data();
};

const createUser = async (data: SpotifyUser) => {
  const userRef = docDataPoint<User>(`users/${data.id}`);
  await userRef.set(data, { merge: true });

  return (await userRef.get()).data();
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

const createSession = async (data) =>
  collectionDataPoint<Session>('sessions').add({
    ...data,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

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

const db = {
  getUser,
  createUser,
  getUserSessions,
  getSessionById,
  createSession,
  deleteSession,
  addTrackToSession,
  removeTrackFromSession,
};

export { db };
