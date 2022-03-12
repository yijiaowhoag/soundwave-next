import { forwardRef } from 'react';
import styled from 'styled-components';
import { Track } from '../generated/graphql';
import PlayableTrack from './PlayableTrack';

interface SearchResultsProps {
  tracks?: Track[];
}

const TracksContainer = styled.div`
  width: ${({ theme }) => theme.columns(7)};
  padding-left: 1rem;

  > ul {
    margin: 0;
    padding: 0;
    background: ${({ theme }) =>
      `linear-gradient(to bottom, transparent 5%, ${theme.colors.lightGreen10} 25%, ${theme.colors.green})`};
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
                <PlayableTrack track={track} ref={ref} />
              </li>
            ))}
          </ul>
        </>
      )}
    </TracksContainer>
  )
);

export default SearchResults;
