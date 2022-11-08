import { forwardRef, useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import useCombinedRefs from '../../hooks/useCombinedRefs';

interface PreviewAudioProps {
  preview_url: string;
}

const Bar = styled.div<{ progress: number }>`
  width: 100%;
  height: 3px;
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

const PreviewAudio = forwardRef<HTMLAudioElement, PreviewAudioProps>(
  ({ preview_url }, ref) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const combinedRef = useCombinedRefs(ref, audioRef);

    const [duration, setDuration] = useState<number>();
    const [currentTime, setCurrentTime] = useState<number>();

    useEffect(() => {
      const audio = audioRef.current;

      if (!audio) return;

      const setAudioData = () => {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
      };

      const setAudioTime = () => {
        console.log('duration', duration, 'currentTime', currentTime);
        setCurrentTime(audio.currentTime);
      };

      audio.addEventListener('loadeddata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);

      return () => {
        audio.removeEventListener('loadeddata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
      };
    }, [audioRef]);

    const percentage =
      currentTime && duration ? (currentTime / duration) * 100 : 0;

    return (
      <>
        <audio ref={combinedRef} src={preview_url} />
        <Bar progress={percentage}></Bar>
      </>
    );
  }
);

export default PreviewAudio;
