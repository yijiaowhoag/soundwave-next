import { NextApiRequest, NextApiResponse } from 'next';
import { serialize, parse } from 'cookie';
import Cookie from 'js-cookie';

const TOKEN_NAME = 'idToken';

export const MAX_AGE = 60 * 60 * 8;

export const setTokenCookie = (res: NextApiResponse, token: string) => {
  const cookie = serialize(TOKEN_NAME, token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });

  res.setHeader('Set-Cookie', cookie);
};

export const parseCookies = (req: NextApiRequest) => {
  // For api routes we don't need to parse the cookies
  if (req.cookies) return req.cookies;

  // For pages we do need to parse the cookies
  const cookie = req.headers?.cookie;

  return parse(cookie || '');
};

export const getTokenCookie = (req: NextApiRequest) => {
  const cookies = parseCookies(req);

  return cookies[TOKEN_NAME];
};

export const removeTokenCookie = (res: NextApiResponse) => {
  const cookie = serialize(TOKEN_NAME, '', {
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
};

export const getUserFromLocalCookie = () => {
  return Cookie.withConverter({ read: (v) => JSON.parse(v) }).get('user');
};

export const getAccessTokenFromLocalCookie = () => {
  return Cookie.get('accessToken');
};

export const setToken = (idToken: string, accessToken: string) => {
  if (!process.browser) {
    return;
  }
  Cookie.set('pinkToken', idToken);
  Cookie.set('accessToken', accessToken);
};

export const unsetToken = () => {
  if (!process.browser) {
    return;
  }
  Cookie.remove('idToken');
  Cookie.remove('accessToken');
};
