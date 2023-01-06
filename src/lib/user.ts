import { db } from '../services/firestore';

interface SpotifyUser {
  [key: string]: any;
}

const createUser = async ({
  id,
  ...rest
}: SpotifyUser): Promise<FirebaseFirestore.DocumentData> => {
  const userRef = db.collection('users').doc(id);
  await userRef.set({ ...rest }, { merge: true });
  const userDoc = await db.collection('users').doc(id).get();

  return { id: userDoc.id, ...userDoc.data() };
};

const findUser = async (
  id: string
): Promise<FirebaseFirestore.DocumentData | undefined> => {
  const userDoc = await db.collection('users').doc(id).get();

  if (userDoc.exists) {
    return { id: userDoc.id, ...userDoc.data() };
  }
};

export const findOrCreateUser = async (
  spotifyUser: SpotifyUser
): Promise<FirebaseFirestore.DocumentData> => {
  const found = await findUser(spotifyUser.id);

  return found || (await createUser(spotifyUser));
};
