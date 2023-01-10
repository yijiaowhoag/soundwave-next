import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import { useArtistQuery } from '../../__generated__/types';
import Layout from '../../components/shared/Layout';
import ArtistTopTracks from '../../components/ArtistTopTracks';
import ArtistCard from '../../components/Artists/ArtistCard';

const Genres = styled.ul`
  display: flex;
  padding: 0;
  list-style: none;

  li {
    margin-right: 1rem;
    opacity: 0.5;
  }
`;

const Main = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 0;
  padding-bottom: 10vh;
`;

const ArtistHeader = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1rem 3rem 0;
  border-bottom: 1.5px solid ${({ theme }) => theme.colors.green};

  > div {
    display: flex;
    align-items: center;
    margin: 0.5rem 0;
    z-index: 1;
  }

  h1 {
    margin: 0;
    margin-right: 0.5em;
    font-size: 3.5rem;
    font-weight: bold;
  }

  p {
    margin-right: 1rem;
    opacity: 0.5;
  }
`;

const SimilarArtists = styled.div`
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

const Artist: React.FC<{ artistId: string }> = ({ artistId }) => {
  const { data, loading } = useArtistQuery({
    variables: { artistId, market: 'US' },
  });

  if (loading) return <p>Loading...</p>;

  if (!data.artistDetails) return null;

  const { artistDetails } = data;
  return (
    <Layout>
      <Main>
        <ArtistHeader>
          <h1>{artistDetails.name}</h1>
          <Genres>
            {artistDetails.genres.map((genre) => (
              <li>{genre}</li>
            ))}
          </Genres>
        </ArtistHeader>
        <ArtistTopTracks popularTracks={artistDetails.topTracks} />
        <SimilarArtists>
          <h2>Fans Also Like</h2>
          <ul>
            {artistDetails.relatedArtists.map((artist) => (
              <li key={artist.id}>
                <ArtistCard artist={artist} />
              </li>
            ))}
          </ul>
        </SimilarArtists>
      </Main>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { artistId: context.params?.id },
  };
};

export default Artist;
