import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa';
import {
  useCreateSessionMutation,
  SessionsDocument,
} from '../generated/graphql';
import Modal from '../components/Modal';
import { OutlineButton } from '../components/Button';
import SessionForm from '../components/SessionForm';
import Sessions from '../components/Sessions';
import TopTracks from '../components/TopTracks';
import TopArtist from '../components/TopArtists';

interface DashboardProps {}

const Main = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 6rem;
  padding-bottom: 10vh;
`;

const ActionBar = styled.div`
  position: absolute;
  left: 0;
  right: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1rem 1rem 0;

  > h2 {
    margin: 0;
  }
`;

const ActionButton = styled(OutlineButton)`
  .plus-icon {
    margin-left: 8px;
    width: 16px;
    height: 16px;
  }
`;

const Dashboard: React.FC<DashboardProps> = ({}) => {
  const [createSession] = useCreateSessionMutation({
    refetchQueries: [
      { query: SessionsDocument, variables: { isRefetch: true } },
    ],
  });

  return (
    <Main>
      <ActionBar>
        <Modal
          activator={
            <ActionButton>
              New Session
              <FaPlus className="plus-icon" />
            </ActionButton>
          }
        >
          {({ closeModal }) => (
            <SessionForm onSubmit={createSession} onClose={closeModal} />
          )}
        </Modal>
      </ActionBar>
      <Sessions />
      <TopTracks />
      <TopArtist />
    </Main>
  );
};

export default Dashboard;
