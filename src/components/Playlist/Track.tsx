import styled, { css } from 'styled-components';
import {
  BsPlayFill,
  BsPauseFill,
  BsSuitHeartFill,
  BsSuitHeart,
} from 'react-icons/bs';
import { RiDeleteBinLine } from 'react-icons/ri';
import { TrackInQueue } from '../../generated/graphql';
import { convertDurationMs } from '../../utils/convertDuration';

const TrackContent = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0 0.5rem 1.8rem;
  background-color: transparent;
  letter-spacing: 0.5px;

  > div:nth-of-type(1) {
    display: flex;
    flex-direction: column;
    width: 60%;
    max-width: 25rem;
    text-overflow: ellipsis;
  }

  > div:nth-of-type(2) {
    display: flex;
  }
`;

const HoverBkg = styled.div<{ isCurrent: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.lightGreen30};
  opacity: 0;
`;

const TrackImage = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 2.5px;
`;

const TrackName = styled.a`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
  line-height: 1.5em;
`;

const TrackArtists = styled.span`
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.7;
  font-size: 0.9em;
`;

const IconWrapper = styled.div`
  width: 22px;
  height: 22px;
  margin: 0.75rem;
  opacity: 0;

  .icon {
    width: 100%;
    height: 100%;
  }
`;

const TrackContainer = styled.div<{
  isSelected: boolean;
  isCurrent: boolean;
  isPaused: boolean;
}>`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-right: 1rem;
  color: ${({ isCurrent, theme }) =>
    isCurrent ? theme.colors.spotifyGreen : 'inherit'};

  ${({ isSelected, theme }) =>
    isSelected &&
    css`
      ${HoverBkg} {
        opacity: 0.8;
        transition: opacity 1s ${({ theme }) => theme.animations.bezier};
      }

      ${IconWrapper} {
        opacity: 1;
        transition: opacity 1s ${({ theme }) => theme.animations.bezier};
      }
    `}

  &:hover {
    ${HoverBkg} {
      opacity: 0.8;
      transition: opacity 1s ${({ theme }) => theme.animations.bezier};
    }

    ${IconWrapper} {
      opacity: 1;
      transition: opacity 1s ${({ theme }) => theme.animations.bezier};
    }
  }

  ${IconWrapper},
  ${TrackImage},
  ${TrackContent} {
    z-index: 1;
  }
`;

interface TrackProps {
  track: TrackInQueue;
  isCurrent: boolean;
  isPaused: boolean;
  isSelected: boolean;
  playTrack: (position: string) => React.MouseEventHandler;
  togglePlay: () => void;
  onAdd?: (track: TrackInQueue) => void;
  onRemove?: (track: TrackInQueue) => void;
}

const Track: React.FC<TrackProps> = ({
  track,
  isCurrent,
  isPaused,
  isSelected,
  playTrack,
  togglePlay,
  onAdd,
  onRemove,
}) => {
  return (
    <TrackContainer
      isSelected={isSelected}
      isCurrent={isCurrent}
      isPaused={isPaused}
    >
      {!isCurrent && (
        <IconWrapper onClick={playTrack(track.id)}>
          <BsPlayFill className="icon" />
        </IconWrapper>
      )}
      {isCurrent && (
        <IconWrapper onClick={togglePlay}>
          {isPaused ? (
            <BsPlayFill className="icon" />
          ) : (
            <BsPauseFill className="icon" />
          )}
        </IconWrapper>
      )}
      <TrackImage
        src={track.images.find((image) => image.height === 300)?.url}
      />
      <TrackContent>
        <div>
          <TrackName>{track.name}</TrackName>
          <TrackArtists>
            {track.artists
              .reduce<string[]>((acc, curr) => [...acc, curr.name], [])
              .join(', ')}
          </TrackArtists>
        </div>
        {/* <IconWrapper onClick={() => onAdd(track)}>
          <BsSuitHeart className="icon" />
        </IconWrapper>
        <IconWrapper onClick={() => onRemove(track)}>
          <RiDeleteBinLine className="icon" />
        </IconWrapper> */}
        <div>
          <span>{convertDurationMs(track.duration_ms)}</span>
        </div>
      </TrackContent>
      <HoverBkg />
    </TrackContainer>
  );
};

export default Track;
