import styled from 'styled-components';
import { TrackInQueue } from '../../__generated__/types';
import { BsPlayCircleFill } from 'react-icons/bs';

interface QueueProps {
  queue?: TrackInQueue[];
  currentTrack?: Spotify.Track;
}

const QueueContainer = styled.div`
  height: 100%;
  padding: 0;
  overflow: scroll;

  h2 {
    margin: 1.5rem 0 0.75rem 1.5rem;
    font-size: 18px;
    color: ${({ theme }) => theme.colors.spotifyGreen};
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
`;

const PlayableTrack = styled.div<{ currentlyPlaying: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75em 1.5rem;
  background-color: ${({ currentlyPlaying, theme }) =>
    currentlyPlaying ? theme.colors.lightGreen30 : 'inherit'};
  color: ${({ currentlyPlaying, theme }) =>
    currentlyPlaying ? theme.colors.spotifyGreen : 'inherit'};

  > div {
    display: flex;
    flex-direction: column;
  }
`;

const TrackName = styled.span`
  margin-bottom: 0.5rem;
  font-weight: bold;
  font-size: 13.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackArtists = styled.span`
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.7;
`;

const PlayIconWrapper = styled.div`
  width: 20px;
  height: 20px;

  .play-icon {
    width: 100%;
    height: 100%;
    fill: ${({ theme }) => theme.colors.spotifyGreen};
    filter: drop-shadow(3px 5px 3px rgba(0, 0, 0, 0.4));
    cursor: pointer;
  }
`;

const Queue: React.FC<QueueProps> = ({ queue, currentTrack }) => {
  return (
    <QueueContainer>
      <h2>Your Queue</h2>
      <ul>
        {queue && queue.length > 0 ? (
          queue.map((track) => (
            <PlayableTrack currentlyPlaying={currentTrack?.id === track.id}>
              <div>
                <TrackName>{track.name}</TrackName>
                <TrackArtists>
                  {track.artists
                    .reduce<string[]>((acc, curr) => [...acc, curr.name], [])
                    .join(', ')}
                </TrackArtists>
              </div>
              <PlayIconWrapper>
                <BsPlayCircleFill className="play-icon" />
              </PlayIconWrapper>
            </PlayableTrack>
          ))
        ) : (
          <p>Nothing is here</p>
        )}
      </ul>
    </QueueContainer>
  );
};

export default Queue;
