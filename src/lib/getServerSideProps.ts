import { NextApiRequest, NextApiResponse } from 'next';
import { getAuthSession } from './authSession';

export const getServerSideProps = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const user = await getAuthSession(req);

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: '/auth/login',
      },
    };
  }

  return { props: { user } };
};
