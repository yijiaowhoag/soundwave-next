import { db } from '../services/firestore';

interface SpotifyUser {
  [key: string]: any;
}

export const findOrCreateUser = async (
  spotifyUser: SpotifyUser
): Promise<FirebaseFirestore.DocumentData> => {
  const found = await db.getUser(spotifyUser.id);

  return found || (await db.createUser(spotifyUser));
};
