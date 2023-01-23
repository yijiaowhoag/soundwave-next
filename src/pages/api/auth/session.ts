import { NextApiRequest, NextApiResponse } from 'next';
import { getCookieFromServer } from '../../../lib/cookies';
import { encrypt, decrypt } from '../../../lib/jwt';
import { refreshAccessToken } from '../../../services/auth';
import { setCookie } from '../../../lib/cookies';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = getCookieFromServer(req, 'sessionToken');
    const session = await decrypt({ token, secret: process.env.TOKEN_SECRET! });

    if (Date.now() > session.exp) {
      const { access_token, expires_in } = await refreshAccessToken(
        session.refreshToken
      );
      session['accessToken'] = access_token;
      session['exp'] = Date.now() + expires_in * 1000;

      const token = await encrypt({
        payload: session,
        secret: process.env.TOKEN_SECRET,
      });
      setCookie(res, { name: 'sessionToken', value: token });
    }

    res.status(200).send({ session });
  } catch (err) {
    res.status(401).send(JSON.stringify(err));
  }
};

export default handler;
