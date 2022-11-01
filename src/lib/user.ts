import { db } from '../services/firestore';

interface SpotifyUser {
  [key: string]: any;
}

const createUser = async ({
  display_name,
  email,
  id,
  images,
  ...rest
}: SpotifyUser): Promise<FirebaseFirestore.DocumentData> => {
  await db
    .collection('users')
    .doc(id)
    .set({
      display_name,
      email,
      images,
      spotify_product: rest.product || null,
    });
  const userDoc = await db.collection('users').doc(id).get();

  return { ...userDoc.data(), id: userDoc.id };
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
