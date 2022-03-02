import { NextApiRequest, NextApiResponse } from 'next';
import { getAuthSession } from '../../../lib/authSession';

const userRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getAuthSession(req);

  if (user) {
    res.json({
      user,
      isAuthenticated: true,
    });
  } else {
    res.json({
      isAuthenticated: false,
    });
  }
};

export default userRoute;
