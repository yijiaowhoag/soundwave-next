import { NextApiRequest, NextApiResponse } from 'next';
import { removeCookie } from '../../../lib/cookies';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  removeCookie(res);

  res.status(200).end();
};

export default handler;
