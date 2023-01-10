import { createRef, forwardRef, useState } from 'react';
import styled from 'styled-components';
import { BsPlayFill, BsPauseFill } from 'react-icons/bs';
import { useAddTrackMutation, Track } from '../../__generated__/types';
import { convertDurationMs } from '../../utils/convertDuration';
import PreviewAudio from './PreviewAudio';
import Menu from '../shared/Menu';

const TrackImageContainer = styled.div`
  position: relative;
  z-index: 1;
  cursor: pointer;
`;

const TrackImage = styled.img`
  position: relative;
  width: 5rem;
  height: 5rem;
  border-radius: 5px;
`;

const PlayIconWrapper = styled.div`
  position: absolute;
  top: 10px;
  bottom: 10px;
  left: 10px;
  right: 10px;
  z-index: 2;
  opacity: 0;
  transform: scale(0);
  transition: ${({ theme }) =>
    `opacity 0.6s ${theme.animations.bezier}, transform 0.6s ${theme.animations.bezier}`};

  .pause-icon,
  .play-icon {
    width: 100%;
    height: 100%;
    filter: drop-shadow(3px 5px 3px rgba(0, 0, 0, 0.4));
  }
`;

const TrackContent = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0 0.5rem 1.8rem;

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

const HoverOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;
  background: ${({ theme }) =>
    `linear-gradient(to right, ${theme.colors.lightGreen30} 60%, transparent)`};
  opacity: 0;
`;

const TrackContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 1rem;

  &:hover {
    ${TrackImage} {
      transform: scale(1.2);
      transition: transform 0.5s ease-in;
    }

    ${PlayIconWrapper} {
      opacity: 1;
      transform: scale(1.1);
      transition: ${({ theme }) =>
        `opacity 0.8s ${theme.animations.bezier}, transform 0.6s ${theme.animations.bezier}`};
    }

    ${HoverOverlay} {
      opacity: 0.9;
      transition: opacity 1s ${({ theme }) => theme.animations.bezier};
    }
  }

  ${TrackImage} {
    transform: scale(1);
    transition: transform 0.6s ${({ theme }) => theme.animations.bezier};
  }
`;

const TrackName = styled.span`
  margin-bottom: 0.6rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
`;

const TrackArtists = styled.span`
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.7;
`;

const TrackPreview = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 2.5rem;

  > span {
    font-weight: bold;
    font-size: 15px;
  }
`;

const IconWrapper = styled.div`
  width: 25px;
  height: 25px;
`;

interface PreviewTrackProps {
  track: Track;
  onAdd?: (track: Track) => void;
}

const PreviewTrack: React.FC<PreviewTrackProps> = forwardRef(
  ({ track }, ref) => {
    const audioRef = createRef<HTMLAudioElement>();
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [addTrack] = useAddTrackMutation();

    const togglePlay = () => {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    };

    return (
      <TrackContainer>
        <TrackImageContainer onClick={togglePlay}>
          {track.preview_url && (
            <PlayIconWrapper>
              {isPlaying ? (
                <BsPauseFill className="pause-icon" />
              ) : (
                <BsPlayFill className="play-icon" />
              )}
            </PlayIconWrapper>
          )}
          <TrackImage
            src={track.album.images.find((image) => image.height === 300)?.url}
          />
        </TrackImageContainer>
        <TrackContent>
          <div>
            <TrackName>{track.name}</TrackName>
            <TrackArtists>
              {track.artists &&
                track.artists
                  .reduce((acc, curr) => [...acc, curr.name], [])
                  .join(', ')}
            </TrackArtists>
          </div>
          <div>
            {track.preview_url && (
              <TrackPreview>
                <span>Preview</span>
                <PreviewAudio ref={audioRef} preview_url={track.preview_url} />
              </TrackPreview>
            )}
            <span>{convertDurationMs(track.duration_ms)}</span>
            <Menu
              onAdd={(sessionId) =>
                addTrack({ variables: { sessionId, track } })
              }
            />
          </div>
        </TrackContent>
        <HoverOverlay />
      </TrackContainer>
    );
  }
);

export default PreviewTrack;
