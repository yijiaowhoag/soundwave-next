import { NextApiRequest } from 'next';
import Iron from '@hapi/iron';
import fetch from 'isomorphic-unfetch';
import querystring from 'querystring';
import { getTokenCookie } from './cookies';

interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  id: string;
}

const TOKEN_SECRET = process.env.TOKEN_SECRET;

export const encryptSession = async (session: AuthSession) =>
  Iron.seal(session, TOKEN_SECRET!, Iron.defaults);

export const getAuthSession = async (req: NextApiRequest) => {
  let token = getTokenCookie(req);

  if (!token) return;

  let session: AuthSession;
  session = await Iron.unseal(token, TOKEN_SECRET!, Iron.defaults);

  // Validate expiration time of session
  if (Date.now() > session.expiresAt) {
    const resp = await refreshAccessToken(session.refreshToken);
    const data = await resp.json();

    session = {
      ...session,
      accessToken: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };
  }

  return session;
};

const refreshAccessToken = async (refreshToken: string) => {
  const encoded = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID!}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  return await fetch(process.env.SPOTIFY_TOKEN_ENDPOINT!, {
    method: 'POST',
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
    headers: {
      Authorization: `Basic ${encoded}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};
