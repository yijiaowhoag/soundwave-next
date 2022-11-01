import { NextApiRequest } from 'next';
import Iron from '@hapi/iron';
import { refreshAccessToken } from '../services/auth';
import { getCookieFromServer } from './cookies';

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  id: string;
}

const TOKEN_SECRET = process.env.TOKEN_SECRET;

export const encryptSession = async (session: AuthSession): Promise<string> =>
  Iron.seal(session, TOKEN_SECRET!, Iron.defaults);

export const getAuthSession = async (
  req: NextApiRequest
): Promise<AuthSession | undefined> => {
  let idToken = getCookieFromServer(req);

  if (!idToken) return;

  const { accessToken, refreshToken, expiresAt, id } = await Iron.unseal(
    idToken,
    TOKEN_SECRET!,
    Iron.defaults
  );

  if (Date.now() > expiresAt) {
    try {
      const data = await refreshAccessToken(refreshToken);

      return {
        accessToken: data.access_token,
        expiresAt: Date.now() + data.expires_in * 1000,
        id,
      };
    } catch (err) {
      throw Error('Invalid token');
    }
  }

  return { accessToken, expiresAt, id };
};
