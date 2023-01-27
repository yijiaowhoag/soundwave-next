import styled, { css } from 'styled-components';
import {
  BsPlayCircleFill,
  BsPauseCircleFill,
  BsSkipStartFill,
  BsSkipEndFill,
  BsShuffle,
  BsArrowRepeat,
} from 'react-icons/bs';
import {
  useShuffleMutation,
  useRepeatMutation,
  Track,
  RepeatMode,
} from '../../__generated__/types';
import { useDevice } from '../../contexts/DeviceContext';
import { usePlayer } from '../../contexts/PlayerContext';
import { usePlaybackState } from '../../contexts/PlaybackStateContext';
import ProgressBar from '../Player/ProgressBar';
import VolumeControl from '../VolumeControl';

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

const ControlGroupDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${({ theme }) => theme.columns(4)};
`;

const ControlGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5em;
`;

const ControlIcon = styled.div`
  margin: 0 1.2em;
  cursor: pointer;

  .icon {
    width: 1.4em;
    height: 1.4em;
  }

  .icon-lg {
    width: 2.4em;
    height: 2.4em;
  }
`;

const StatefulIcon = styled(ControlIcon)<{ enabled: boolean }>`
  ${({ enabled, theme }) =>
    enabled &&
    css`
      svg {
        fill: ${theme.colors.spotifyGreen};
      }
    `}
`;

enum PlaybackStateRepeat {
  OFF,
  CONTEXT,
  TRACK,
}

interface PlayerProps {
  playNow?: (tracks: Track[]) => void;
}

const PlayerBar: React.FC<PlayerProps> = () => {
  const device = useDevice();
  const player = usePlayer();
  const playbackState = usePlaybackState();

  const [shuffle] = useShuffleMutation();
  const [repeat] = useRepeatMutation();

  const onVolumeChange = (volume: number) => {
    if (!player) return;
    if (volume === 0) {
      player.setVolume(0.000001);
    } else {
      player.setVolume(volume);
    }
  };

  const toggleShuffle = () => {
    if (!device || !playbackState) return;
    shuffle({
      variables: {
        deviceId: device.id,
        state: !playbackState.shuffle,
      },
    });
  };

  const toggleRepeat = () => {
    if (!device || !playbackState) return;
    repeat({
      variables: {
        deviceId: device.id,
        state: [RepeatMode.Off, RepeatMode.Context, RepeatMode.Track][
          (playbackState.repeat_mode + 1) % 3
        ],
      },
    });
  };

  const curr = playbackState?.track_window.current_track;
  const isPaused = playbackState?.paused ?? true;
  return (
    <>
      <Container>
        {curr && (
          <TrackInfo>
            <TrackImage
              src={curr.album.images.find((image) => image.height === 300)?.url}
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
        <ControlGroupDiv>
          <ControlGroup>
            <StatefulIcon
              enabled={playbackState ? playbackState.shuffle : false}
              onClick={toggleShuffle}
            >
              <BsShuffle className="icon" />
            </StatefulIcon>
            {player ? (
              <ControlIcon onClick={() => player.previousTrack()}>
                <BsSkipStartFill className="icon" />
              </ControlIcon>
            ) : (
              <div />
            )}
            {player ? (
              <ControlIcon onClick={() => player.togglePlay()}>
                {isPaused ? (
                  <BsPlayCircleFill className="icon-lg" />
                ) : (
                  <BsPauseCircleFill className="icon-lg" />
                )}
              </ControlIcon>
            ) : (
              <div />
            )}
            {player ? (
              <ControlIcon onClick={() => player.nextTrack()}>
                <BsSkipEndFill className="icon" />
              </ControlIcon>
            ) : (
              <div />
            )}
            <StatefulIcon
              enabled={
                playbackState?.repeat_mode !== PlaybackStateRepeat.OFF ?? false
              }
              onClick={toggleRepeat}
            >
              <BsArrowRepeat className="icon" />
            </StatefulIcon>
          </ControlGroup>
          <ProgressBar playerState={playbackState} />
        </ControlGroupDiv>
        <VolumeControl openProp={true} onVolumeChange={onVolumeChange} />
      </Container>
    </>
  );
};

export default PlayerBar;
