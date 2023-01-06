import type { NextApiRequest, NextApiResponse } from 'next';
import { removeCookie } from '../../../lib/cookies';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  removeCookie(res, 'accessToken');
  removeCookie(res, 'refreshToken');

  res.status(200).end();
};

export default handler;
