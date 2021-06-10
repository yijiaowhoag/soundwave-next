import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import Button from '../../components/Button';
import Player from '../../components/Player';
import Sidebar from '../../components/Sidebar';
import { getAuthSession } from '../../lib/session';
import { useAddTrack, useRemoveTrack } from '../../graphql/mutations';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;

  > div:first-child {
    width: ${({ theme }) => theme.columns(5)};
  }
`;

const Session: React.FC<{ sessionId: string; token: string }> = ({
  sessionId,
  token,
}) => {
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
        <Player queue={sessionData?.session.queue || []} token={token} />
          <Playlist
            tracks={sessionData?.session.queue || []}
            onRemove={(track) =>
              removeFromSession({ variables: { sessionId, track } })
            }
          />
        </div>
        <Sidebar width={450}>
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
        </Sidebar>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const authSession = await getAuthSession(context.req);

  return {
    props: { sessionId: context.params?.id, token: authSession?.accessToken },
  };
};

export default Session;
