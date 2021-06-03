import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import { getAuthSession } from '../lib/session';
import { useCreateSession } from '../graphql/mutations';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import Button from '../components/Button';
import SessionForm from '../components/SessionForm';
import Sessions from '../components/Sessions';

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
  left: 0;
  right: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1rem 1rem 0;

  > h2 {
    margin: 0 0 0 4rem;
  }
`;

const ActionButton = styled(Button)`
  > span {
    margin-right: 8px;
    white-space: nowrap;
    color: ${({ theme }) => theme.colors.darkGreen};
  }

  > img {
    width: 20px;
    height: 20px;
  }
`;

const Index = () => {
  const [createSession] = useCreateSession();

  return (
    <Layout>
      <Main>
        <ActionBar>
          <h2>My Sessions</h2>
          <Modal
            activator={({ setOpen }) => (
              <ActionButton onClick={() => setOpen(true)}>
                <span>New</span>
                <img src="/plus.svg" alt="Plus Icon" />
              </ActionButton>
            )}
          >
            <SessionForm onSubmit={createSession} />
          </Modal>
        </ActionBar>
        <Sessions />
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
