import { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  BsPlayCircleFill,
  BsPauseCircleFill,
  BsSkipStartFill,
  BsSkipEndFill,
  BsShuffle,
  BsArrowRepeat,
} from 'react-icons/bs';
import { usePlayer } from '../../contexts/PlayerContext';
import { usePlaybackState } from '../../contexts/PlaybackStateContext';

const ControlGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 1.2em;
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

interface ControlsProps {
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

const Controls: React.FC<ControlsProps> = ({ toggleShuffle, toggleRepeat }) => {
  const player = usePlayer();
  const playbackState = usePlaybackState();

  const [isShuffle, setShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<number>(0);

  useEffect(() => {
    if (!playbackState) return;

    setShuffle(playbackState.shuffle);
    setRepeatMode(playbackState.repeat_mode);
  }, [playbackState]);

  const isPaused = playbackState?.paused ?? true;
  return (
    <ControlGroup>
      <ControlIcon on={isShuffle} onClick={toggleShuffle}>
        <BsShuffle className="icon" />
      </ControlIcon>
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
      <ControlIcon on={repeatMode != 0} onClick={toggleRepeat}>
        <BsArrowRepeat className="icon" />
      </ControlIcon>
    </ControlGroup>
  );
};

export default Controls;
