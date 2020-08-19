import { NextApiRequest, NextApiResponse } from 'next';
import { getAccessToken } from '../../../services/auth';
import { encryptSession } from '../../../lib/session';
import { setTokenCookie } from '../../../lib/cookies';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let resp;
  try {
    resp = await getAccessToken(req.query.code);

    const session = {
      accessToken: resp.access_token,
      refreshToken: resp.refresh_token,
      expiresAt: Date.now() + resp.expires_in * 1000,
    };
    const token = await encryptSession(session);
    setTokenCookie(res, token);

    return res.redirect('/');
  } catch (err) {
    console.error(err);

    res.status(401).send(err.message);
  }
};

export default handler;
