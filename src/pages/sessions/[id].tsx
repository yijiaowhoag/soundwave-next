import styled from 'styled-components';
import { BsPlayCircleFill } from 'react-icons/bs';
import type { GetServerSideProps } from 'next';
import { useSessionQuery, usePlayMutation } from '../../__generated__/types';
import { useDevice } from '../../contexts/DeviceContext';
import Layout from '../../components/shared/Layout';
import EditBtn, { EditIcon } from '../../components/SessionForm/EditBtn';
import Playlist from '../../components/Playlist';
import Player from '../../components/Player';

const Container = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;

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
  border-bottom: 1.5px solid ${({ theme }) => theme.colors.green};
`;

const SessionInfo = styled.div`
  position: relative;
  display: flex;
  height: ${({ theme }) => theme.columns(2.5)};

  > div:last-child {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 1.5rem 0;

    h1,
    p {
      margin: 1em 0.5em 0 0;
      cursor: pointer;
    }

    h1 {
      font-size: 3.2rem;
      font-weight: bold;
    }

    p {
      opacity: 0.5;
    }
  }
`;

const Cover = styled.div`
  width: ${({ theme }) => theme.columns(2.5)};
  padding: 1.5rem;

  img {
    width: 100%;
    height: 100%;
    box-shadow: 8px 10px 10px ${({ theme }) => theme.shadow.darkest};
    object-fit: cover;
  }
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

const PlayIconWrapper = styled.div<{ enabled: boolean }>`
  width: 3em;
  height: 3em;
  border-radius: 100%;
  box-shadow: 5px 10px 15px ${({ theme }) => theme.shadow.darkest};
  background-color: white;
  opacity: 1;

  .play-icon {
    width: 100%;
    height: 100%;
    fill: ${({ enabled, theme }) =>
      enabled ? theme.colors.spotifyGreen : theme.colors.disabled};
    cursor: pointer;
  }
`;

const SessionQueue = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
`;

const PlayerContainer = styled.div`
  width: ${({ theme }) => theme.columns(4)};
  border-left: 1.5px solid ${({ theme }) => theme.colors.green};
`;

const Session: React.FC<{ sessionId: string }> = ({ sessionId }) => {
  const device = useDevice();

  const { data, loading } = useSessionQuery({ variables: { sessionId } });
  const [play] = usePlayMutation();

  const uris = data?.session.queue.map((track) => track.uri);
  const playSession = () => {
    if (!device || !uris || uris.length === 0) return;

    play({
      variables: { deviceId: device.id, uris },
    });
  };

  if (loading) return <p>Loading...</p>;

  if (!data?.session) return null;

  return (
    <Layout>
      {data?.session && (
        <Container>
          <Header>
            <SessionInfo>
              {data.session.cover && (
                <Cover>
                  <img src={data.session.cover} />
                </Cover>
              )}
              <div>
                <h1>{data.session.name}</h1>
                <p>{data.session.description || ''}</p>
              </div>
            </SessionInfo>
            <ActionBar>
              <PlayIconWrapper enabled={!!device} className="icon-wrapper">
                <BsPlayCircleFill onClick={playSession} className="play-icon" />
              </PlayIconWrapper>
              <EditBtn
                sessionId={sessionId}
                initialValues={{
                  name: data.session.name,
                  description: data.session.description,
                  cover: data.session.cover,
                }}
                editIconStyle="outline"
              />
            </ActionBar>
          </Header>
          <SessionQueue>
            <Playlist sessionId={sessionId} queue={data.session.queue} />
            <PlayerContainer>
              <Player queue={data.session.queue} />
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
