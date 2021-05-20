import { gql, useQuery, NetworkStatus } from '@apollo/client';
import Router from 'next/router';
import { getSession } from '../lib/session';

const GET_USER_TOP_TRACKS = gql`
  query UserTopTracks($offset: Int, $limit: Int) {
    userTopTracks(offset: $offset, limit: $limit) {
      id
      name
      artists {
        id
        name
      }
    }
  }
`;

const Index = () => {
  const { loading, data, error, fetchMore, networkStatus } = useQuery(
    GET_USER_TOP_TRACKS,
    {
      variables: { offset: 0, limit: 15 },
      notifyOnNetworkStatusChange: true,
    }
  );

  if (loading) return null;

  if (error?.graphQLErrors && error.graphQLErrors.length > 0) {
    error.graphQLErrors.map((err) => {
      if (err.extensions?.code === 'UNAUTHENTICATED') {
        Router.push('/login');
      }
    });
  }

  const loadingMore = networkStatus === NetworkStatus.fetchMore;

  return (
    <div>
      <ol>
        {data.userTopTracks &&
          data.userTopTracks.map((track) => <li>{track.name}</li>)}
      </ol>
      <button
        onClick={() => {
          fetchMore({
            variables: {
              offset: data.userTopTracks.length,
            },
          });
        }}
      >
        Load More
      </button>
    </div>
  );
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
