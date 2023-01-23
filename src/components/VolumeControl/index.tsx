import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BiVolumeFull, BiVolumeMute } from 'react-icons/bi';
import VolumeSlider from './VolumeSlider';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  min-width: 10em;
`;

const VolumeControlIcon = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-right: 0.5em;
  cursor: pointer;

  .icon {
    width: 1.8em;
    height: 1.8em;
  }
`;

const Slider = styled.div<{ open: boolean }>`
  position: relative;
  transform: ${({ open }) => (open ? `scale(1)` : `scale(0)`)};
`;

interface VolumeControlProps {
  openProp?: boolean;
  onVolumeChange: (volume: number) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({
  openProp,
  onVolumeChange,
}) => {
  const [open, setOpen] = useState<boolean>(openProp ?? false);
  const [isMuted, setMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);

  useEffect(() => {
    if (isMuted) {
      onVolumeChange(0);
    } else {
      onVolumeChange(volume);
    }
  }, [isMuted, volume]);

  const noop = () => {};
  return (
    <Wrapper>
      <VolumeControlIcon onClick={openProp ? noop : () => setOpen(!open)}>
        {isMuted ? (
          <BiVolumeMute className="icon" />
        ) : (
          <BiVolumeFull className="icon" />
        )}
      </VolumeControlIcon>
      <Slider open={open}>
        <VolumeSlider
          isMuted={isMuted}
          setMuted={setMuted}
          volume={volume}
          setVolume={setVolume}
        />
      </Slider>
    </Wrapper>
  );
};

export default VolumeControl;
