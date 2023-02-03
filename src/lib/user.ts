import { db } from '../services/firestore';
import type { SpotifyUser } from '../types';

export const findOrCreateUser = async (
  spotifyUser: SpotifyUser
): Promise<FirebaseFirestore.DocumentData> => {
  const found = await db.getUser(spotifyUser.id);

  return found || (await db.createUser(spotifyUser));
};
