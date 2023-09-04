import styled from 'styled-components';
import type { GetServerSideProps } from 'next';
import { useSessionQuery, usePlayMutation } from '../../__generated__/types';
import { useDevice } from '../../contexts/DeviceContext';
import Error from '../../components/shared/Error';
import Layout from '../../components/shared/Layout';
import EditBtn from '../../components/SessionForm/EditBtn';
import PlayBtn from '../../components/Session/PlayBtn';
import PlaylistContainer from '../../components/Playlist/Container';
import Playlist from '../../components/Playlist';
import PlayerContainer from '../../components/Player/Container';
import Player from '../../components/Player';

const Container = styled.div`
  --playerWidth: ${({ theme }) => theme.columns(3.5)};
  --headerHeight: ${({ theme }) => theme.columns(2.5)};

  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;

  .underlay {
    position: absolute;
    top: ${({ theme }) => theme.columns(1)};
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ theme }) =>
      `linear-gradient(to bottom, transparent 10%, ${theme.colors.lightGreen10} 25%, ${theme.colors.green})`};
  }
`;

const Header = styled.div`
  position: relative;
  padding-right: var(--playerWidth);
  border-bottom: 1.5px solid ${({ theme }) => theme.colors.green};
`;

const SessionInfo = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;

  h1,
  p {
    margin: 0;
    cursor: pointer;
  }

  h1 {
    font-size: 3.5rem;
    font-weight: bold;
  }
`;

const SessionCover = styled.img`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 25% 25%;
`;

const ActionBar = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  padding: 0 1.5rem 1rem 1.5rem;
  font-size: 16px;

  .icon-wrapper {
    margin-right: 1em;
  }
`;

const SessionQueue = styled.div`
  z-index: 1;
  display: flex;
  flex: 1;
`;

const Session: React.FC<{ sessionId: string }> = ({ sessionId }) => {
  const device = useDevice();

  const { data, loading, error } = useSessionQuery({
    variables: { sessionId },
  });
  const [play] = usePlayMutation();

  if (loading) return <p>Loading...</p>;
  if (error) return <Error error={error} />;

  const uris = data?.session.queue.map((track) => track.uri);
  const playSession = () => {
    if (!device || !uris || uris.length === 0) return;

    play({
      variables: { deviceId: device.id, uris },
    });
  };

  const { session } = data;
  return (
    <Layout>
      {session && (
        <Container>
          <Header>
            <SessionInfo>
              <h1>{session.name}</h1>
              <p>{session.description || ''}</p>
            </SessionInfo>
            {session.cover && (
              <SessionCover src={data.session.cover}></SessionCover>
            )}
            <ActionBar>
              <PlayBtn disabled={!device} play={playSession} />
              <EditBtn
                sessionId={sessionId}
                initialValues={{
                  name: session.name,
                  description: session.description,
                  cover: session.cover,
                }}
                editIconStyle="outline"
              />
            </ActionBar>
          </Header>
          <SessionQueue>
            <PlaylistContainer>
              <Playlist
                sessionId={sessionId}
                queue={session.queue}
                updateQueueOffset={() => {}}
              />
            </PlaylistContainer>
            <PlayerContainer>
              <Player queue={session.queue} />
            </PlayerContainer>
          </SessionQueue>
          <div className="underlay" />
        </Container>
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { sessionId: context.params?.id },
  };
};

export default Session;
