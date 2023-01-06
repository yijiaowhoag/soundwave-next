import type { GetServerSidePropsContext } from 'next';
import { getAuthSession } from './authSession';

export const getServerSideProps = async (
  req: GetServerSidePropsContext['req'],
  res: GetServerSidePropsContext['res']
) => {
  const session = await getAuthSession(req, res);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/auth/login',
      },
    };
  }

  return { props: { token: session?.accessToken } };
};
