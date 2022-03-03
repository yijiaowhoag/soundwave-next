import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { convertDurationMs } from '../utils/convertDuration';

interface ProgressBarProps {
  playerState?: Spotify.PlaybackState;
}

const BarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Bar = styled.div<{ progress: number }>`
  width: 100%;
  height: 0.2em;
  margin: 0 0.5em;
  border-radius: 0.1em;
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
  font-size: 1em;
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
    <BarContainer>
      <Info>{convertDurationMs(progress)}</Info>
      <Bar progress={percentage}></Bar>
      <Info>{convertDurationMs(playerState?.duration || 0)}</Info>
    </BarContainer>
  );
};

export default ProgressBar;
