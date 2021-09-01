import styled from 'styled-components';
import { useUserTopArtistsQuery } from '../generated/graphql';
import Avatar from '../components/Avatar';

const ArtistsDiv = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    width: 45px;
    height: 100%;
    box-shadow: inset 15px 0 15px ${({ theme }) => theme.colors.darkGreen};
  }

  &:after {
    content: '';
    position: absolute;
    right: 0;
    width: 45px;
    height: 100%;
    box-shadow: inset -15px 0 15px ${({ theme }) => theme.colors.darkGreen};
  }

  > h2 {
    margin-top: 0;
    margin-left: 4rem;
  }
`;

const Artist = styled.div`
  margin-right: 1.2rem;
  text-align: center;

  > h5 {
    width: 80px;
  }
`;

const Artists = styled.div`
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;

  > ${Artist}:first-child {
    margin-left: 4rem;
  }
`;

const TopArtists: React.FC = () => {
  const { data, loading } = useUserTopArtistsQuery({
    variables: {
      offset: 0,
      limit: 20,
    },
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!data?.userTopArtists) return null;

  return (
    <ArtistsDiv>
      <h2>Favorite Artists</h2>
      <Artists>
        {data.userTopArtists.map((artist: any) => (
          <Artist key={artist.id}>
            <Avatar src={artist.images[0].url} />
            <h5>{artist.name}</h5>
          </Artist>
        ))}
      </Artists>
    </ArtistsDiv>
  );
};

export default TopArtists;
