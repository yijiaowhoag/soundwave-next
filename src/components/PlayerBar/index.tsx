import styled from 'styled-components';
import usePlayerControls from '../../hooks/usePlayerControls';
import Controls from '../Player/Controls';
import ProgressBar from '../Player/ProgressBar';
import VolumeControl from '../VolumeControl';
import type { PreviewTrack } from '../../types';

const Container = styled.div`
  position: fixed;
  bottom: 0;
  z-index: 9999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 6rem;
  padding: 1em 2em;
  color: white;
  background-color: ${({ theme }) => theme.colors.green};
  font-size: 14px;
  letter-spacing: 0.5px;

  > div:nth-of-type(1) {
    position: absolute;
    left: 0;
  }

  > div:nth-of-type(2) {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    transform: translate(-50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: ${({ theme }) => theme.columns(4)};
  }

  > div:nth-of-type(3) {
    position: absolute;
    right: 2em;
  }
`;

const TrackImage = styled.img`
  width: 4.5em;
  height: 4.5em;
  margin-right: 1.5em;
  border-radius: 5px;
  box-shadow: 0 10px 10px ${({ theme }) => theme.shadow.dark};
`;

const TrackInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    h2 {
      margin: 0;
      font-size: 18px;
    }

    p {
      margin: 0;
      font-size: 16px;
      opacity: 0.7;
    }
  }
`;

interface PlayerProps {
  lastPlayedTrack?: PreviewTrack;
}

const PlayerBar: React.FC<PlayerProps> = ({ lastPlayedTrack }) => {
  const { playbackState, onVolumeChange, curr } = usePlayerControls();

  return (
    <>
      <Container>
        <div>
          {curr && (
            <TrackInfo>
              <TrackImage
                src={
                  curr.album.images.find((image) => image.height === 300)?.url
                }
              />
              <div>
                <h2>{curr.name}</h2>
                <p>
                  {curr.artists
                    .reduce((acc, curr) => [...acc, curr.name], [])
                    .join(',')}
                </p>
              </div>
            </TrackInfo>
          )}
        </div>
        <div>
          <Controls controlGroupStyles={{ marginBottom: '0.5em' }} />
          <ProgressBar playerState={playbackState} />
        </div>
        <div>
          <VolumeControl openProp={true} onVolumeChange={onVolumeChange} />
        </div>
      </Container>
    </>
  );
};

export default PlayerBar;
