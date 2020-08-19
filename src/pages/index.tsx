import { getSession } from '../lib/session';

const Index = () => {
  return <div></div>;
};

export const getServerSideProps = async ({ req, res }) => {
  const user = await getSession(req);

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }

  return { props: {} };
};

export default Index;
