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
  usePlayMutation,
  useShuffleMutation,
  useRepeatMutation,
  TrackInQueue,
  RepeatMode,
} from '../../generated/graphql';
import { useDevice } from '../../contexts/DeviceContext';
import { usePlayer } from '../../contexts/PlayerContext';
import ProgressBar from './ProgressBar';
import VolumeControl from './Volume';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 1.5em;
  font-size: 15px;
  letter-spacing: 0.5px;

  h2 {
    margin: 0;
    font-size: 20px;
  }
`;

const PlayerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const TrackImage = styled.img`
  width: 8.5em;
  height: 8.5em;
  margin: 0.5em;
  border-radius: 1em;
  box-shadow: 0 0 1.5em 0.5em rgba(63, 119, 89, 0.7);
`;

const TrackInfo = styled.div`
  margin: 0 auto;
  text-align: center;

  h2 {
    margin: 1em auto 0.5em;
    font-size: 1.5em;
    line-height: 1.5em;
  }

  p {
    margin: 0.5em 0;
    font-size: 1.2em;
    opacity: 0.7;
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

const ControlGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 1.2em;
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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45px;
  height: 45px;
  border-radius: 100%;

  ${({ enabled, theme }) =>
    enabled &&
    css`
      box-shadow: 0 0 15px ${theme.colors.lightGreen30};
      background-color: ${theme.colors.lightGreen30};

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
  queue: TrackInQueue[];
}

const Player: React.FC<PlayerProps> = ({ queue }) => {
  const device = useDevice();
  const { player, playbackState } = usePlayer();

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
    if (!device || !queue) return;

    shuffle({
      variables: {
        deviceId: device.id,
        state: playbackState ? !playbackState.shuffle : true,
      },
    });
  };

  const toggleRepeat = () => {
    if (!device || !playbackState) return;

    repeat({
      variables: {
        deviceId: device.id,
        state:
          playbackState.repeat_mode === PlaybackStateRepeat.OFF
            ? RepeatMode.Track
            : RepeatMode.Off,
      },
    });
  };

  const initial = 0;
  const curr = playbackState
    ? playbackState.track_window.current_track
    : queue[initial];
  const next = playbackState
    ? playbackState.track_window.next_tracks[0]
    : queue[initial + 1];
  const isPaused = playbackState?.paused ?? true;
  return (
    <>
      <Container>
        <PlayerHeader>
          <h2>Now Playing</h2>
          <VolumeControl onVolumeChange={onVolumeChange} />
        </PlayerHeader>
        {curr && (
          <TrackInfo>
            <TrackImage
              src={
                (curr.images || curr.album.images).find(
                  (image) => image.height === 300
                )?.url
              }
            />
            <h2>{curr.name}</h2>
            <p>
              {curr.artists
                .reduce((acc, curr) => [...acc, curr.name], [])
                .join(',')}
            </p>
          </TrackInfo>
        )}
        <ProgressBar playerState={playbackState} />
        <NextTrack>
          <span>Next</span>
          <span>{next ? next.name : 'Unavailable'}</span>
        </NextTrack>
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
      </Container>
    </>
  );
};

export default Player;
