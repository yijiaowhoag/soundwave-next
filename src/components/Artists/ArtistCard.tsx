import Link from 'next/link';
import styled from 'styled-components';
import { Artist } from '../../__generated__/types';

interface ArtistCardProps {
  artist: Partial<Artist>;
}

const Card = styled.div`
  position: relative;
  width: 180px;
  height: 240px;
  margin-right: 1rem;
  text-align: center;
`;

const Image = styled.div<{ imageSrc?: string }>`
  width: 180px;
  height: 150px;
  border-radius: 5px 5px 0 0;
  background-image: url(${({ imageSrc }) => imageSrc});
  background-size: cover;
  background-position: top;
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 5px;
  background: ${({ theme }) => `linear-gradient(
    to bottom,
    transparent,
    rgba(63, 119, 89, 0.3),
    rgba(63, 119, 89, 0.7)
  )`};
`;

const Info = styled.div`
  position: absolute;
  top: 150px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.8rem 1rem;

  h4 {
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  div {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
  }

  span {
    font-size: 15px;
    opacity: 0.7;
    white-space: nowrap;
  }
`;

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => (
  <Link href={`/artists/${artist.id}`}>
    <Card>
      <ImageOverlay />
      <Image
        imageSrc={artist.images.filter((image) => image.height < 640)[0].url}
      />
      <Info>
        <h4>{artist.name}</h4>
        <div>
          {artist.genres.slice(0, 2).map((genre) => (
            <span>{genre}</span>
          ))}
        </div>
      </Info>
    </Card>
  </Link>
);

export default ArtistCard;
