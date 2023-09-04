import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa';
import {
  useUserRecentlyPlayedQuery,
  usePlayMutation,
} from '../__generated__/types';
import { useDevice } from '../contexts/DeviceContext';
import Error from '../components/shared/Error';
import Layout from '../components/shared/Layout';
import Modal from '../components/shared/Modal';
import { OutlineButton } from '../components/shared/Button';
import SessionForm from '../components/SessionForm';
import Sessions from '../components/Sessions';
import UserTopItems from '../components/UserTopItems';
import RecentTracks from '../components/UserTopItems/Tracks';
import PlayerBar from '../components/PlayerBar';

const Main = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 0;
  padding-bottom: 16vh;
`;

const ActionBar = styled.div`
  position: absolute;
  left: 0;
  right: 2.5rem;
  display: flex;
  align-items: center;
  padding: 1.2rem 0;

  h2 {
    margin: 0 1rem 0 2rem;
    font-weight: bold;
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

const Dashboard: React.FC = () => {
  const device = useDevice();
  const { data, loading, error } = useUserRecentlyPlayedQuery();
  const [play] = usePlayMutation();

  const handlePlayQueue = (uris: string[], offset: number) => {
    if (!device) return;

    play({ variables: { deviceId: device.id, uris, offset } });
  };

  return (
    <>
      <Layout>
        <Main>
          <>
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
            <RecentTracks
              heading="Recently Played"
              tracks={data?.userRecentlyPlayed}
              handlePlayQueue={handlePlayQueue}
            />
            <UserTopItems handlePlayQueue={handlePlayQueue} />
          </>
        </Main>
      </Layout>
      <PlayerBar lastPlayedTrack={data?.userRecentlyPlayed[0]} />
    </>
  );
};

export default Dashboard;
