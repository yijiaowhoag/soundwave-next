import styled, { css } from 'styled-components';
import {
  BsPlayCircleFill,
  BsPauseCircleFill,
  BsSkipStartFill,
  BsSkipEndFill,
  BsShuffle,
  BsArrowRepeat,
} from 'react-icons/bs';
import usePlayerControls from '../../hooks/usePlayerControls';

const ControlGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const ControlIcon = styled.div<{ on?: boolean }>`
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
interface ControlsProps {
  controlGroupStyles?: React.CSSProperties;
}

const Controls: React.FC<ControlsProps> = ({ controlGroupStyles }) => {
  const { player, playbackState, toggleShuffle, toggleRepeat, isPaused } =
    usePlayerControls();

  return (
    <ControlGroup style={controlGroupStyles}>
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
  );
};

export default Controls;
