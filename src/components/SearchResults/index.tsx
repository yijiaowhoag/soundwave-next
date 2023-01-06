import { forwardRef } from 'react';
import styled from 'styled-components';
import { Track } from '../../__generated__/types';
import PreviewTrack from './PreviewTrack';

interface SearchResultsProps {
  tracks?: Track[];
}

const TracksContainer = styled.div`
  width: ${({ theme }) => theme.columns(7)};
  padding: 0 1rem 0 2rem;
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
                <PreviewTrack track={track} ref={ref} />
              </li>
            ))}
          </ul>
        </>
      )}
    </TracksContainer>
  )
);

export default SearchResults;
