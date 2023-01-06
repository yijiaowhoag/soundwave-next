import { NextApiRequest, NextApiResponse } from 'next';
import { getAccessToken, getSelf } from '../../../services/auth';
import { encrypt } from '../../../lib/jwt';
import { setCookie } from '../../../lib/cookies';
import { findOrCreateUser } from '../../../lib/user';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { access_token, refresh_token, expires_in } = await getAccessToken(
      req.query.code ?? ''
    );
    const me = await getSelf(access_token);

    const user = await findOrCreateUser(me);
    const session = {
      accessToken: access_token,
      refreshToken: refresh_token,
      exp: Date.now() + expires_in * 1000,
      user: {
        id: user.id,
        name: user.display_name,
        email: user.email,
        avatar: images.find((image) => image.height === 300) || images[0].url,
      },
    };

    if (!process.env.TOKEN_SECRET) return;

    const token = await encrypt({
      payload: session,
      secret: process.env.TOKEN_SECRET,
    });
    setCookie(res, { name: 'sessionToken', value: token });

    res.redirect('/');
  } catch (err) {
    console.error(err);

    res.status(401).send(JSON.stringify(err));
  }
};

export default handler;
