import { NextApiRequest, NextApiResponse } from 'next';
import { randomBytes } from 'crypto';
import querystring from 'querystring';
import { setCookie } from '../../../lib/cookies';

const SCOPES: string[] = [
  'user-read-email',
  'user-read-private',
  'user-top-read',
  'streaming',
];

const AUTH_STATE_KEY = 'spotify_auth_state';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const state = randomBytes(16).toString('hex');
  setCookie(res, { name: AUTH_STATE_KEY, value: state });

  const qs = querystring.stringify({
    client_id: process.env.SPOTIFY_CLIENT_ID,
    response_type: 'code',
    scope: SCOPES.join(' '),
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    state,
  });

  res.redirect(`${process.env.SPOTIFY_AUTH_ENDPOINT}?${qs}`);
};

export default handler;
