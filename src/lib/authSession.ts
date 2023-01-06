import Iron from '@hapi/iron';
import { refreshAccessToken } from '../services/auth';
import { getCookieFromServer, setCookie } from './cookies';
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';

interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  exp: number;
  user: User;
}

const TOKEN_SECRET = process.env.TOKEN_SECRET;

export const encryptSession = async (session: AuthSession): Promise<string> =>
  Iron.seal(session, TOKEN_SECRET!, Iron.defaults);

export const decryptSession = async (sessionToken: string) =>
  await Iron.unseal(sessionToken, TOKEN_SECRET!, Iron.defaults);

export const getAuthSession = async (
  req: GetServerSidePropsContext['req'] | NextApiRequest,
  res: GetServerSidePropsContext['res'] | NextApiResponse
): Promise<AuthSession | undefined> => {
  let sessionToken = getCookieFromServer(req, 'sessionToken');

  if (!sessionToken) return;

  const session = await decryptSession(sessionToken);

  if (Date.now() > session.exp) {
    const { access_token, expires_in } = await refreshAccessToken(
      session.refreshToken
    );
    session['accessToken'] = access_token;
    session['exp'] = Date.now() + expires_in * 1000;

    const token = await encryptSession(session);
    setCookie(res, { name: 'sessionToken', value: token });
  }

  return session;
};
