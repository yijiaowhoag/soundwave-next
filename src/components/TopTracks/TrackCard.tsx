import styled from 'styled-components';
import { Track } from '../../__generated__/types';

interface TrackCardProps {
  track: Track;
}

const Card = styled.div`
  position: relative;
`;

const Image = styled.img`
  width: 240px;
  height: 240px;
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
    rgba(63, 119, 89, 0.3),
    rgba(63, 119, 89, 0.9)
  )`};
`;

const Info = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  flex-direction: column;
  padding: 1rem;

  > span:first-child {
    font-weight: bold;
    font-size: 19px;
  }
`;

const TrackCard: React.FC<TrackCardProps> = ({ track }) => (
  <Card>
    <ImageOverlay />
    <Image src={track.images.find((image) => image.height === 300)?.url} />
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
