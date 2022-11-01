import { NextApiRequest, NextApiResponse } from 'next';
import { getAccessToken, getSelf } from '../../../services/auth';
import { encryptSession } from '../../../lib/authSession';
import { setCookie } from '../../../lib/cookies';
import { findOrCreateUser } from '../../../lib/user';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { access_token, refresh_token, expires_in } = await getAccessToken(
      req.query.code
    );
    const me = await getSelf(access_token);

    const user = await findOrCreateUser(me);

    const session = {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: Date.now() + expires_in * 1000,
      id: user.id,
    };

    const token = await encryptSession(session);
    setCookie(res, token);

    res.redirect('/');
  } catch (err) {
    console.error(err);

    res.status(401).send(JSON.stringify(err));
  }
};

export default handler;
