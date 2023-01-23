import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import { useArtistQuery } from '../../__generated__/types';
import Layout from '../../components/shared/Layout';
import ArtistTopTracks from '../../components/ArtistTopTracks';
import SimilarArtists from '../../components/Artists';

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

const Artist: React.FC<{ artistId: string }> = ({ artistId }) => {
  const { data, loading, error } = useArtistQuery({
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
              <li key={genre}>{genre}</li>
            ))}
          </Genres>
        </ArtistHeader>
        <ArtistTopTracks popularTracks={artistDetails.topTracks} />
        <SimilarArtists
          heading="Fans Also Like"
          artists={artistDetails.relatedArtists}
        />
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
