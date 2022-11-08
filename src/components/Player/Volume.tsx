import React, {
  useRef,
  useMemo,
  useCallback,
  useState,
  useEffect,
} from 'react';
import styled from 'styled-components';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

interface VolumeProps {
  isMuted: boolean;
  setMuted: (isMuted: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  min?: number;
  max?: number;
}

const THUMB_SIZE = '1.2em';

const Wrapper = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
`;

const CSSVariables = styled.div`
  --thumbSize: 1.2em;
  --trackSize: 0.45em;
  --thumbBg: #fff;
  --trackBg: #b6b6b6;
  --progressBg: rgba(63, 119, 89, 1);
`;

const Input = styled.input`
  -webkit-appearance: none;
  appearance: none;
  width: 9em;
  height: var(--trackSize);
  margin: 0;
  transform-origin: left center;
  transform: rotate(90deg);
  background: transparent;
  cursor: pointer;

  &::-webkit-slider-runnable-track {
    height: var(--trackSize);
    border-radius: var(--trackSize);
    background: linear-gradient(
      90deg,
      var(--progressBg) var(--webkitProgressPercent),
      var(--trackBg) var(--webkitProgressPercent)
    );
  }

  &::-moz-range-track {
    height: var(--trackSize);
    border-radius: var(--trackSize);
    background-color: ${({ theme }) => theme.colors.light};
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: var(--thumbSize);
    height: var(--thumbSize);
    margin-top: calc((var(--thumbSize) - var(--trackSize)) / 2 * (-1));
    border-radius: 100%;
    border: 0;
    background-color: ${({ theme }) => theme.colors.lightGreen};
  }

  &::-moz-range-thumb {
    appearance: none;
    width: var(--thumbSize);
    height: var(--thumbSize);
    border-radius: 100%;
    border: 0;
    background-color: ${({ theme }) => theme.colors.lightGreen};
  }
`;

const Volume: React.FC<VolumeProps> = ({
  min = 0,
  max = 1,
  isMuted,
  setMuted,
  volume,
  setVolume,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isChanging, setIsChanging] = useState(false);

  const handleMouseDown = () => setIsChanging(true);

  const handleMouseUpAndLeave = () => setIsChanging(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = +e.target.value;
    if (val === 0) {
      setMuted(true);
      setVolume(0.000001);
    } else {
      setMuted(false);
      setVolume(val);
    }
  };

  const getPercent = useMemo(
    () => (value: number) => ((value - min) / (max - min)) * 100,
    [max, min]
  );

  const changeInputProgressPercentStyle = useCallback(() => {
    inputRef.current &&
      inputRef.current.style.setProperty(
        '--webkitProgressPercent',
        `${getPercent(+inputRef.current.value)}%`
      );
  }, [getPercent]);

  useEffect(() => {
    changeInputProgressPercentStyle();
    const inputEl = inputRef.current;

    if (!inputEl) return;

    inputEl.addEventListener('mousemove', changeInputProgressPercentStyle);
    inputEl.addEventListener('mousedown', handleMouseDown);
    inputEl.addEventListener('mouseup', handleMouseUpAndLeave);
    inputEl.addEventListener('mouseleave', handleMouseUpAndLeave);
    return () => {
      inputEl.removeEventListener('mousemove', changeInputProgressPercentStyle);
      inputEl.removeEventListener('mousedown', handleMouseDown);
      inputEl.removeEventListener('mouseup', handleMouseUpAndLeave);
      inputEl.removeEventListener('mouseleave', handleMouseUpAndLeave);
    };
  }, [isChanging, changeInputProgressPercentStyle]);

  useEffect(() => {
    if (!inputRef?.current) return;
    changeInputProgressPercentStyle();
  }, [inputRef, changeInputProgressPercentStyle]);

  return (
    <CSSVariables>
      <Wrapper>
        <Input
          ref={inputRef}
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={isMuted ? 0 : volume}
          onChange={handleChange}
        />
      </Wrapper>
    </CSSVariables>
  );
};

const VolumeControlIcon = styled.div`
  position: relative;
  margin: 0;
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

const VolumeSlider = styled.div<{ open: boolean }>`
  transform: ${({ open }) => (open ? `scale(1)` : `scale(0)`)};
`;

interface VolumeControlProps {
  onVolumeChange: (volume: number) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ onVolumeChange }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isMuted, setMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);

  useEffect(() => {
    if (isMuted) {
      onVolumeChange(0);
    } else {
      onVolumeChange(volume);
    }
  }, [isMuted, volume]);

  return (
    <VolumeControlIcon onClick={() => setOpen(!open)}>
      {isMuted ? (
        <FaVolumeMute className="icon" />
      ) : (
        <FaVolumeUp className="icon" />
      )}
      <VolumeSlider open={open}>
        <Volume
          isMuted={isMuted}
          setMuted={setMuted}
          volume={volume}
          setVolume={setVolume}
        />
      </VolumeSlider>
    </VolumeControlIcon>
  );
};

export default VolumeControl;
