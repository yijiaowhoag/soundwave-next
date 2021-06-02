import { GetServerSideProps } from 'next';
import { gql, useQuery, NetworkStatus } from '@apollo/client';
import Router from 'next/router';
import styled from 'styled-components';
import { getAuthSession } from '../lib/session';
import { useCreateSession } from '../graphql/mutations';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import Button from '../components/Button';
import SessionForm from '../components/SessionForm';

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

const Main = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 80vw;
  padding-top: 10vh;
  padding-bottom: 10vh;
  background-color: ${({ theme }) => theme.colors.darkGreen};
`;

const ActionBar = styled.div`
  position: absolute;
  top: 10vh;
  right: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1rem 1rem 0;
`;

const Index = () => {
  const [createSession] = useCreateSession();
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
    <Layout>
      <Main>
        <ActionBar>
          <Modal
            activator={({ setOpen }) => (
              <Button onClick={() => setOpen(true)}>Open Modal</Button>
            )}
          >
            <SessionForm onSubmit={createSession} />
          </Modal>
        </ActionBar>
        <div>
          <ol>
            {data.userTopTracks &&
              data.userTopTracks.map((track) => <li>{track.name}</li>)}
          </ol>
          <Button
            onClick={() => {
              fetchMore({
                variables: {
                  offset: data.userTopTracks.length,
                },
              });
            }}
          >
            Load More
          </Button>
        </div>
      </Main>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const user = await getAuthSession(req);

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
