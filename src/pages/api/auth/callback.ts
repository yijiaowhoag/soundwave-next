import { NextApiRequest, NextApiResponse } from 'next';
import querystring from 'querystring';
import { getAccessToken, getSelf } from '../../../services/auth';
import { encrypt } from '../../../lib/jwt';
import {
  getCookieFromServer,
  setCookie,
  removeCookie,
} from '../../../lib/cookies';
import { findOrCreateUser } from '../../../lib/user';

const AUTH_STATE_KEY = 'spotify_auth_state';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { code, state } = req.query;
  const storedState = getCookieFromServer(req, AUTH_STATE_KEY);

  if (!state || state !== storedState) {
    res.redirect(
      '/#' +
        querystring.stringify({
          error: 'state_mismatch',
        })
    );
  } else {
    removeCookie(res, AUTH_STATE_KEY);
    try {
      const { access_token, refresh_token, expires_in } = await getAccessToken(
        code
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
          avatar:
            user.images.find((image) => image.height === 300) ||
            user.images[0].url,
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

      res.redirect(
        '/#' +
          querystring.stringify({
            error: 'invalid_token',
          })
      );
    }
  }
};

export default handler;
