import { forwardRef } from 'react';
import styled from 'styled-components';
import PreviewTrack from './PreviewTrack';
import { PreviewTrack as SearchResult } from '../../types';

interface SearchResultsProps {
  tracks?: SearchResult[];
}

const TracksContainer = styled.div`
  width: ${({ theme }) => theme.columns(7)};
  max-width: calc(100% - 320px);
  padding: 0 1rem 0 1.5rem;
  background-color: ${({ theme }) => theme.colors.lightGreen10};

  > ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
`;

const SearchResults: React.FC<SearchResultsProps> = forwardRef(
  ({ tracks }, ref) => (
    <TracksContainer>
      {tracks && (
        <>
          <h3>Tracklist</h3>
          <ul>
            {tracks.map((track) => (
              <li key={track.id}>
                <PreviewTrack track={track} />
              </li>
            ))}
          </ul>
        </>
      )}
    </TracksContainer>
  )
);

export default SearchResults;
