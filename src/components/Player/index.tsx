import styled from 'styled-components';
import usePlayerControls from '../../hooks/usePlayerControls';
import VolumeControl from '../VolumeControl';
import CurrentTrack from './CurrentTrack';
import Controls from './Controls';
import ProgressBar from './ProgressBar';
import type { PlaylistTrack } from '../../types';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  max-height: 680px;
  padding: 1.5em;
  font-size: 15px;
  letter-spacing: 0.5px;
`;

const PlayerHeader = styled.div`
  display: flex;

  h2 {
    margin: 0;
    margin-right: 0.8em;
    font-size: 20px;
  }
`;

const NextTrack = styled.span`
  display: flex;
  flex-direction: column;
  font-size: 18px;

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  span:first-child {
    font-weight: bold;
  }
`;

interface PlayerProps {
  queue: PlaylistTrack[];
}

const Player: React.FC<PlayerProps> = ({ queue }) => {
  const { playbackState, onVolumeChange, curr, next } = usePlayerControls();

  return (
    <>
      <Container>
        <PlayerHeader>
          <h2>Now Playing</h2>
          <VolumeControl openProp={false} onVolumeChange={onVolumeChange} />
        </PlayerHeader>
        <CurrentTrack
          name={curr?.name}
          artists={curr?.artists
            .reduce<string[]>((acc, curr) => [...acc, curr.name], [])
            .join(', ')}
          cover={curr?.album.images.find((image) => image.height === 300)?.url}
        />
        <Controls controlGroupStyles={{ marginTop: '1.2em' }} />
        <ProgressBar playerState={playbackState} />
        <NextTrack>
          <span>Next</span>
          <span>{next ? next.name : 'Unavailable'}</span>
        </NextTrack>
      </Container>
    </>
  );
};

export default Player;
