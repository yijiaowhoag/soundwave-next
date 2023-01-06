import { NextApiRequest, NextApiResponse } from 'next';
import { getCookieFromServer } from '../../../lib/cookies';
import { decrypt } from '../../../lib/jwt';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = getCookieFromServer(req, 'sessionToken');
    const session = await decrypt({ token, secret: process.env.TOKEN_SECRET! });

    res.status(200).send({ session });
  } catch (err) {
    res.status(401).send(JSON.stringify(err));
  }
};

export default handler;
