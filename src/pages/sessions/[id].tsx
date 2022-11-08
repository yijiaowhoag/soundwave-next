import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import { BsPlayCircleFill } from 'react-icons/bs';
import { useSessionQuery, usePlayMutation } from '../../generated/graphql';
import { getServerSideProps as serverProps } from '../../lib/getServerSideProps';
import { AuthSession } from '../../lib/authSession';
import { useDevice } from '../../contexts/DeviceContext';
import Layout from '../../components/Layout';
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

  > div:last-child {
    display: flex;
    flex: 1;
  }
`;

const SessionInfo = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 3rem 0;
  border-bottom: 1.5px solid ${({ theme }) => theme.colors.green};

  h1 {
    margin: 0;
    margin-right: 0.5em;
    font-size: 3.5rem;
    font-weight: bold;
  }

  p {
    margin-right: 1rem;
    opacity: 0.5;
  }
`;

const SessionHead = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
`;

const PlayIconWrapper = styled.div`
  width: 55px;
  height: 55px;
  border-radius: 100%;
  box-shadow: 0 10px 15px ${({ theme }) => theme.shadow.dark};
  background-color: white;
  opacity: 1;

  .play-icon {
    width: 100%;
    height: 100%;
    fill: ${({ theme }) => theme.colors.spotifyGreen};
    cursor: pointer;
  }
`;

const PlayerContainer = styled.div`
  width: ${({ theme }) => theme.columns(4)};
  border-left: 1.5px solid ${({ theme }) => theme.colors.green};
`;

const Session: React.FC<{ sessionId: string; user: AuthSession }> = ({
  sessionId,
}) => {
  const device = useDevice();

  const { data, loading } = useSessionQuery({ variables: { sessionId } });
  const [play] = usePlayMutation();

  if (loading) return <p>Loading...</p>;

  if (!data?.session) return null;

  const uris = data.session.queue.map((track) => track.uri);
  return (
    <Layout>
      {data?.session && (
        <Container>
          <SessionInfo>
            <SessionHead>
              <h1>{data.session.name}</h1>
              <PlayIconWrapper>
                {device ? (
                  <BsPlayCircleFill
                    onClick={() =>
                      play({
                        variables: { deviceId: device.id, uris },
                      })
                    }
                    className="play-icon"
                  />
                ) : (
                  <div />
                )}
              </PlayIconWrapper>
            </SessionHead>
            <p>{data.session.description || ''}</p>
          </SessionInfo>
          <div>
            <Playlist queue={data.session.queue} />
            <PlayerContainer>
              <Player queue={data.session.queue} />
            </PlayerContainer>
          </div>
        </Container>
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { props } = await serverProps(context);

  return {
    props: {
      ...props,
      ...{ sessionId: context.params?.id },
    },
  };
};

export default Session;
