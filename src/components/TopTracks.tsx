import styled from 'styled-components';
import { BsPlayFill } from 'react-icons/bs';
import { useUserTopTracksQuery, AddTrackInput } from '../generated/graphql';
import TrackCard from './TrackCard';
import { OutlineButton } from './Button';

interface TopTracksProps {}

const TopTracksDiv = styled.div`
  ul {
    display: flex;
    align-items: center;
    width: 100%;
    margin: 0;
    padding: 0;
    overflow-x: scroll;
    list-style: none;
  }
`;

const TopTracksHeader = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;

  h2 {
    margin: 0;
    font-size: 20px;
  }
`;

const PlayButton = styled(OutlineButton)`
  margin-left: 1rem;

  .play-icon {
    margin-left: 8px;
    width: 16px;
    height: 16px;
  }
`;

const FetchMoreButton = styled(OutlineButton)`
  margin: 0 2.5rem;
`;

const TopTracks: React.FC<TopTracksProps> = () => {
  const { data, loading, fetchMore } = useUserTopTracksQuery({
    variables: { offset: 0, limit: 20 },
  });

  return (
    <TopTracksDiv>
      <TopTracksHeader>
        <h2>Weekly Top Tracks</h2>
        <PlayButton onClick={() => {}}>
          Play
          <BsPlayFill className="play-icon" />
        </PlayButton>
      </TopTracksHeader>
      {loading && <p>Loading...</p>}
      {data && (
        <ul>
          {data.userTopTracks.map((track) => (
            <li key={track.id}>
              <TrackCard track={track} />
            </li>
          ))}
          <FetchMoreButton
            onClick={() => {
              fetchMore({
                variables: {
                  offset: data.userTopTracks.length,
                },
              });
            }}
          >
            Load More
          </FetchMoreButton>
        </ul>
      )}
    </TopTracksDiv>
  );
};

export default TopTracks;
