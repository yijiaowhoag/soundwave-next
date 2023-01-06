import styled from 'styled-components';
import { BsPlayFill } from 'react-icons/bs';
import { useUserTopTracksQuery } from '../../__generated__/types';
import Modal from '../shared/Modal';
import { OutlineButton } from '../shared/Button';
import TrackCard from './TrackCard';
import Player from '../Player';

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
  padding: 1.5rem 0;

  h2 {
    margin: 0 1rem 0 2rem;
    font-weight: 400;
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

const TopTracks: React.FC = () => {
  const { data, loading, fetchMore } = useUserTopTracksQuery({
    variables: { offset: 0, limit: 20 },
  });

  return (
    <TopTracksDiv>
      <TopTracksHeader>
        <h2>Weekly Top Tracks</h2>
        <Modal
          activator={
            <PlayButton>
              Play
              <BsPlayFill className="play-icon" />
            </PlayButton>
          }
        >
          {({ closeModal }) => <Player queue={data?.userTopTracks ?? []} />}
        </Modal>
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
