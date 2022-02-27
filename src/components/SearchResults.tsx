import React from 'react';
import styled from 'styled-components';
import { Track } from '../generated/graphql';
import PlayableTrack from './PlayableTrack';

interface SearchResultsProps {
  tracks: Track[];
}

const TracksContainer = styled.div`
  width: ${({ theme }) => theme.columns(7)};
  padding-right: 1rem;
`;

const SearchResults: React.FC<SearchResultsProps> = ({ tracks }) => {
  return (
    <TracksContainer>
      {tracks.map((track) => (
        <PlayableTrack key={track.id} track={track} />
      ))}
    </TracksContainer>
  );
};

export default SearchResults;
