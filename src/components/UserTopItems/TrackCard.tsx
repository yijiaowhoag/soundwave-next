import styled from 'styled-components';
import { BsPlayCircleFill } from 'react-icons/bs';
import type { Album } from '../../__generated__/types';
import type { Modify, Optional, PreviewTrack } from '../../types';

const PlayIconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  width: 60px;
  height: 60px;
  border-radius: 100%;
  box-shadow: 0 10px 15px ${({ theme }) => theme.shadow.dark};
  background-color: white;
  opacity: 0;

  .play-icon {
    width: 100%;
    height: 100%;
    fill: ${({ theme }) => theme.colors.spotifyGreen};
    cursor: pointer;
  }
`;

const Card = styled.div`
  position: relative;
  width: 200px;
  height: 200px;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 2px;
    background: ${({ theme }) =>
      `linear-gradient(to bottom, ${theme.colors.lightGreen10}, ${theme.colors.lightGreen})`};
  }

  &:hover {
    ${PlayIconWrapper} {
      opacity: 1;
      bottom: 2rem;
      transition: opacity 0.6s ${({ theme }) => theme.animations.bezier},
        bottom 0.8s ${({ theme }) => theme.animations.bezier};
    }
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${({ theme }) => `linear-gradient(
    to bottom,
    transparent,
    ${theme.colors.lightGreen10} 45%,
    ${theme.colors.lightGreen75}
  )`};
`;

const Info = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 1rem;
  text-shadow: 3px 3px 2px ${({ theme }) => theme.shadow.darkest};

  > span:first-child {
    font-weight: bold;
    font-size: 18px;
  }
`;

export type TrackCard = Modify<
  PreviewTrack,
  {
    album: Optional<Album, 'id' | 'name'>;
  }
>;

interface TrackCardProps {
  track: TrackCard;
}

const TrackCard: React.FC<TrackCardProps> = ({ track }) => (
  <Card>
    <PlayIconWrapper>
      <BsPlayCircleFill
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="play-icon"
      />
    </PlayIconWrapper>
    <ImageOverlay />
    <Image
      src={track.album.images.find((image) => image.height === 300)?.url}
    />
    <Info>
      <span>{track.name}</span>
      <span>
        {track.artists
          .reduce<string[]>((acc, curr) => [...acc, curr.name], [])
          .join(', ')}
      </span>
    </Info>
  </Card>
);

export default TrackCard;
