import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { convertDurationMs } from '../utils/convertDuration';

interface ProgressBarProps {
  playerState?: Spotify.PlaybackState;
}

const Bar = styled.div<{ progress: number }>`
  height: 5px;
  margin-top: 0.5rem;
  border-radius: 2.5px;
  background: ${({ progress, theme }) =>
    `linear-gradient(
    to right,
    ${theme.colors.lightGreen} 0%,
    ${theme.colors.lightGreen} ${progress}%,
    grey ${progress}%,
    grey 100%
  );`};
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
`;

const ProgressBar: React.FC<ProgressBarProps> = ({ playerState }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (playerState) {
      setProgress(playerState.position);

      if (!playerState.paused) {
        interval = setInterval(() => {
          setProgress((prev) => prev + 300);
        }, 300);
      }
    }

    return () => clearInterval(interval);
  }, [playerState]);

  const percentage = playerState ? (progress / playerState.duration) * 100 : 0;
  return (
    <>
      <Info>
        <div>{convertDurationMs(progress)}</div>
        <div>{convertDurationMs(playerState?.duration || 0)}</div>
      </Info>
      <Bar progress={percentage}></Bar>
    </>
  );
};

export default ProgressBar;
