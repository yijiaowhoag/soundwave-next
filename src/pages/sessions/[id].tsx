import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import Button from '../../components/Button';
import Playlist, { HorizontalPlaylist } from '../../components/Playlist';
import Player from '../..//components/Player';
import { useTopTracks, useGetSession } from '../../graphql/queries';
import { useAddTrack, useRemoveTrack } from '../../graphql/mutations';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;

  div:first-child {
    width: ${({ theme }) => theme.columns(5)};
  }
`;

const Participants = styled.div``;

const Session: React.FC<{ sessionId: string }> = ({ sessionId }) => {
  const { data: sessionData } = useGetSession({ sessionId });
  const [addToSession] = useAddTrack();
  const [removeFromSession] = useRemoveTrack();

  const {
    loading,
    data: topTracksData,
    error,
    fetchMore,
    networkStatus,
  } = useTopTracks({
    offset: 0,
    limit: 15,
  });

  return (
    <>
      <Container>
        {/* <Player
          queue={sessionData?.session.playlist || []}
          token={props.access_token}
        />
        <Player queue={data?.topTracksData?.items || []} />
        <Participants>
          {sessionData?.participants?.map(({ username }) => (
            <span>{username}</span>
          ))}
        </Participants>
        <HorizontalPlaylist tracks={sessionData?.session.playlist || []} /> */}

        <div>
          <h1>Playlist: {sessionData?.name}</h1>
          <Playlist
            tracks={sessionData?.session.queue || []}
            onRemove={(track) =>
              removeFromSession({ variables: { sessionId, track } })
            }
          />
        </div>
        <div>
          <h1>Spotify Top Tracks</h1>
          {topTracksData?.userTopTracks && (
            <Playlist
              tracks={topTracksData?.userTopTracks || []}
              onAdd={(track) =>
                addToSession({ variables: { sessionId, track } })
              }
            />
          )}
          <Button
            onClick={() => {
              fetchMore({
                variables: {
                  offset: topTracksData.userTopTracks.length,
                },
              });
            }}
          >
            Load More
          </Button>
        </div>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { sessionId: context.params?.id },
  };
};

export default Session;
