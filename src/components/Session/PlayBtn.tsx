import React from 'react';
import styled from 'styled-components';
import { BsPlayCircleFill } from 'react-icons/bs';

const PlayIconWrapper = styled.div<{ disabled: boolean }>`
  width: 3em;
  height: 3em;
  border-radius: 100%;
  box-shadow: 5px 10px 15px ${({ theme }) => theme.shadow.darkest};
  background-color: white;
  opacity: 1;

  .play-icon {
    width: 100%;
    height: 100%;
    fill: ${({ disabled, theme }) =>
      disabled ? theme.colors.disabled : theme.colors.spotifyGreen};
    cursor: pointer;
  }
`;

interface PlayBtnProps {
  disabled: boolean;
  play: () => void;
}

const PlayBtn: React.FC<PlayBtnProps> = ({ disabled, play }) => {
  return (
    <PlayIconWrapper disabled={disabled} className="icon-wrapper">
      <BsPlayCircleFill onClick={play} className="play-icon" />
    </PlayIconWrapper>
  );
};

export default PlayBtn;
