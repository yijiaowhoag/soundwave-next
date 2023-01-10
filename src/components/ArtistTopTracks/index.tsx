import { useState } from 'react';
import styled from 'styled-components';
import { Track } from '../../__generated__/types';
import { OutlineButton } from '../shared/Button';
import PreviewTrack from '../SearchResults/PreviewTrack';

const ArtistTracksDiv = styled.div`
  ul {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 760px;
    margin: 0;
    list-style: none;
  }
`;

const ArtistTracksHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem 0;

  h2 {
    margin: 0 1rem 0 2rem;
    font-weight: 400;
    font-size: 20px;
  }
`;

const ShowMoreButton = styled(OutlineButton)`
  margin-left: 1rem;
`;

interface ArtistTopTracksProps {
  popularTracks: Partial<Track>[];
}

const ArtistTopTracks: React.FC<ArtistTopTracksProps> = ({ popularTracks }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <ArtistTracksDiv>
      <ArtistTracksHeader>
        <h2>Popular Tracks</h2>
        <ShowMoreButton onClick={() => setShowMore(!showMore)}>
          {showMore ? 'Show Less' : 'See More'}
        </ShowMoreButton>
      </ArtistTracksHeader>
      <ul>
        {popularTracks.slice(0, 5).map((track) => (
          <li key={`${track.id}`}>
            <PreviewTrack track={track} />
          </li>
        ))}
        {showMore &&
          popularTracks.slice(5).map((track) => (
            <li key={`${track.id}`}>
              <PreviewTrack track={track} />
            </li>
          ))}
      </ul>
    </ArtistTracksDiv>
  );
};

export default ArtistTopTracks;
