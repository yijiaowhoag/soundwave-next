import { NextApiRequest, NextApiResponse } from 'next';
import { getAuthSession } from '../../../lib/authSession';

const userRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const user = await getAuthSession(req);
    res.status(200).send({ user });
  } catch (err) {
    res.status(401).send(JSON.stringify(err));
  }
};

export default userRoute;
