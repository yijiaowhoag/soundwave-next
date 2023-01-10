import Link from 'next/link';
import styled from 'styled-components';
import { useUserTopArtistsQuery } from '../../__generated__/types';

const ArtistsDiv = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  h2 {
    margin: 2rem;
    font-weight: 400;
    font-size: 20px;
  }

  ul {
    display: flex;
    margin: 0;
    padding: 0;
    overflow-x: scroll;
    list-style: none;

    li:first-child {
      margin-left: 2rem;
    }
  }
`;

const ArtistCard = styled.div`
  margin-right: 1rem;
  text-align: center;
`;

const ArtistImage = styled.div<{ imageSrc?: string }>`
  width: 160px;
  height: 120px;
  border-radius: 5px;
  background-image: url(${({ imageSrc }) => imageSrc});
  background-size: cover;
  background-position: center;
`;

const ArtistName = styled.h5`
  margin: 0.8rem 0;
`;

const TopArtists: React.FC = () => {
  const { data, loading } = useUserTopArtistsQuery({
    variables: {
      offset: 0,
      limit: 20,
    },
  });

  if (loading) return <p>Loading...</p>;

  if (!data?.userTopArtists) return null;

  return (
    <ArtistsDiv>
      <h2>Recent Artists</h2>
      <ul>
        {data.userTopArtists.map((artist) => (
          <li key={artist.id}>
            <Link href={`/artists/${artist.id}`}>
              <ArtistCard>
                <ArtistImage
                  imageSrc={
                    artist.images.filter((image) => image.height < 640)[0].url
                  }
                />
                <ArtistName>{artist.name}</ArtistName>
              </ArtistCard>
            </Link>
          </li>
        ))}
      </ul>
    </ArtistsDiv>
  );
};

export default TopArtists;
