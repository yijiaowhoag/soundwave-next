import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa';
import Layout from '../components/shared/Layout';
import Modal from '../components/shared/Modal';
import { OutlineButton } from '../components/shared/Button';
import SessionForm from '../components/SessionForm';
import Sessions from '../components/Sessions';
import TopTracks from '../components/TopTracks';
import TopArtists from '../components/Artists';

const Main = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 0;
  padding-bottom: 10vh;
`;

const ActionBar = styled.div`
  position: absolute;
  left: 0;
  right: 2.5rem;
  display: flex;
  align-items: center;
  padding: 1.5rem 0;

  h2 {
    margin: 0 1rem 0 2rem;
    font-weight: 400;
    font-size: 20px;
  }
`;

const ActionButton = styled(OutlineButton)`
  margin-left: 1rem;

  .plus-icon {
    margin-left: 8px;
    width: 16px;
    height: 16px;
  }
`;

const Dashboard: React.FC = () => (
  <Layout>
    <Main>
      <ActionBar>
        <h2>My Sessions</h2>
        <Modal
          activator={
            <ActionButton>
              New Session
              <FaPlus className="plus-icon" />
            </ActionButton>
          }
        >
          {({ closeModal }) => <SessionForm onClose={closeModal} />}
        </Modal>
      </ActionBar>
      <Sessions />
      <TopTracks />
      <TopArtists />
    </Main>
  </Layout>
);

export default Dashboard;
