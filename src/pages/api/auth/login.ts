import { NextApiRequest, NextApiResponse } from 'next';
import querystring from 'querystring';

const SCOPES: string[] = [
  'user-read-email',
  'user-read-private',
  'user-top-read',
  'streaming',
];

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const qs = querystring.stringify({
    client_id: process.env.SPOTIFY_CLIENT_ID,
    response_type: 'code',
    scope: SCOPES.join(' '),
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    state: '',
  });

  return res.redirect(`${process.env.SPOTIFY_AUTH_ENDPOINT}?${qs}`);
};

export default handler;
