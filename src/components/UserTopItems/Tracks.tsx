import styled from 'styled-components';
import { BsPlayFill } from 'react-icons/bs';
import { OutlineButton } from '../shared/Button';
import TrackCard, { TrackCard as TrackCardType } from './TrackCard';

const TracksDiv = styled.div`
  ul {
    display: flex;
    align-items: center;
    width: 100%;
    margin: 0;
    padding: 0;
    overflow-x: scroll;
    overflow-y: hidden;
    list-style: none;
  }
`;

const TracksHeader = styled.div`
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

interface TracksProps {
  heading: string;
  tracks?: TrackCardType[];
  onFetchMore?: () => void;
  handlePlayQueue: (uris: string[], offset: number) => void;
}

const Tracks: React.FC<TracksProps> = ({
  heading,
  tracks,
  onFetchMore,
  handlePlayQueue,
}) => {
  const play = () => {
    if (!tracks) return;

    const uris = tracks.map((track) => track.uri);

    handlePlayQueue(uris, 0);
  };

  const noop = () => {};
  return (
    <TracksDiv>
      <TracksHeader>
        <h2>{heading}</h2>
        <PlayButton onClick={play}>
          Play
          <BsPlayFill className="play-icon" />
        </PlayButton>
      </TracksHeader>
      {tracks && (
        <ul>
          {tracks.map((track, idx) => (
            <li key={`${track.id}-${idx}`}>
              <TrackCard track={track} />
            </li>
          ))}
          <FetchMoreButton onClick={onFetchMore ?? noop}>
            Load More
          </FetchMoreButton>
        </ul>
      )}
    </TracksDiv>
  );
};

export default Tracks;
