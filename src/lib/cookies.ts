import { serialize, parse, CookieSerializeOptions } from 'cookie';
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import type { ServerResponse } from 'http';

export interface Cookie {
  name: string;
  value: string;
  options?: CookieSerializeOptions;
}

export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const parseCookies = (
  req: GetServerSidePropsContext['req'] | NextApiRequest
) => {
  // For api routes we don't need to parse the cookies
  if (req.cookies) return req.cookies;

  // For pages we do need to parse the cookies
  const cookie = req.headers?.cookie;

  return parse(cookie || '');
};

export const getCookieFromServer = (
  req: GetServerSidePropsContext['req'] | NextApiRequest,
  cookieName: string
) => {
  const cookies = parseCookies(req);

  return cookies[cookieName];
};

export const setCookie = (
  res: NextApiResponse | ServerResponse,
  cookie: Cookie
) => {
  let setCookieHeader = res.getHeader('Set-Cookie') ?? [];

  if (!Array.isArray(setCookieHeader)) setCookieHeader = [`${setCookieHeader}`];

  const defaultOptions = {
    expires: new Date(Date.now() + SESSION_MAX_AGE * 1000),
    httpOnly: true,
    maxAge: SESSION_MAX_AGE,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  } as CookieSerializeOptions;

  const cookieHeader = serialize(
    cookie.name,
    cookie.value,
    cookie.options ?? defaultOptions
  );
  setCookieHeader.push(cookieHeader);

  res.setHeader('Set-Cookie', setCookieHeader);
};

export const removeCookie = (res: NextApiResponse, cookieName: string) => {
  const cookie = serialize(cookieName, '', {
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
};
