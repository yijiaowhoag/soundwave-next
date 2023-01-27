import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa';
import {
  useUserTopArtistsQuery,
  usePlayMutation,
} from '../__generated__/types';
import { useDevice } from '../contexts/DeviceContext';
import Layout from '../components/shared/Layout';
import Modal from '../components/shared/Modal';
import { OutlineButton } from '../components/shared/Button';
import SessionForm from '../components/SessionForm';
import Sessions from '../components/Sessions';
import TopTracks from '../components/TopTracks';
import TopArtists from '../components/Artists';
import PlayerBar from '../components/PlayerBar';

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

const Dashboard: React.FC = () => {
  const device = useDevice();

  const { data, loading, error } = useUserTopArtistsQuery({
    variables: {
      offset: 0,
      limit: 20,
    },
  });
  const [play] = usePlayMutation();

  const handlePlayQueue = (uris: string[], offset: number) => {
    if (!device) return;

    play({ variables: { deviceId: device.id, uris, offset } });
  };

  return (
    <>
      <Layout>
        <Main>
          {error && <strong>Error: {JSON.stringify(error)}</strong>}
          {loading && <span>Loading...</span>}
          {data && (
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
              <TopTracks handlePlayQueue={handlePlayQueue} />
              <TopArtists
                heading="Recent Artists"
                artists={data.userTopArtists}
                loading={loading}
                error={JSON.stringify(error)}
              />
            </>
          )}
        </Main>
      </Layout>
      <PlayerBar />
    </>
  );
};

export default Dashboard;
