import styled from 'styled-components';
import type { Artist as SpotifyArtist } from '../../__generated__/types';
import ArtistCard from './ArtistCard';

const ArtistsDiv = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  h2 {
    margin: 2rem;
    font-weight: 400;
    font-size: 20px;
  }

  p {
    margin: 0;
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

interface ArtistsProps {
  heading: string;
  artists?: Partial<SpotifyArtist[]>;
  loading?: boolean;
  error?: string;
}

const Artists: React.FC<ArtistsProps> = ({
  heading,
  artists,
  loading = false,
  error,
}) => {
  return (
    <ArtistsDiv>
      <h2>{heading}</h2>
      <p>
        {error && <strong>Error: {error}</strong>}
        {loading && <span>Loading...</span>}
      </p>
      {artists && (
        <ul>
          {artists.map((artist) => (
            <li key={artist.id}>
              <ArtistCard artist={artist} />
            </li>
          ))}
        </ul>
      )}
    </ArtistsDiv>
  );
};

export default Artists;
