import { NextApiResponse, NextApiRequest } from 'next';
import { serialize, parse } from 'cookie';

const TOKEN_NAME = 'idToken';

export const MAX_AGE = 60 * 60 * 24 * 3; // 3 days

export const parseCookies = (req: NextApiRequest) => {
  // For api routes we don't need to parse the cookies
  if (req.cookies) return req.cookies;

  // For pages we do need to parse the cookies
  const cookie = req.headers?.cookie;

  return parse(cookie || '');
};

export const getCookieFromServer = (req: NextApiRequest) => {
  const cookies = parseCookies(req);

  return cookies[TOKEN_NAME];
};

export const setCookie = (res: NextApiResponse, token: string) => {
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

export const removeCookie = (res: NextApiResponse) => {
  const cookie = serialize(TOKEN_NAME, '', {
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
};
