import { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRecommendationsLazyQuery } from '../__generated__/types';
import Layout from '../components/shared/Layout';
import SearchSelect from '../components/Search/SearchSelect';
import AudioFilters from '../components/SearchResults/AudioFilters';
import SearchResults from '../components/SearchResults';

const SIDE_CONTAINER_WIDTH = '320px';

const SearchBar = styled.div`
  margin-right: ${SIDE_CONTAINER_WIDTH};
  .Select-menu-outer {
    z-index: 100 !important;
  }
`;

const ResultsContainer = styled.div<{ active: boolean }>`
  position: relative;
  display: flex;
  flex: 1;
  justify-content: space-between;
  min-height: 100%;
  transform: scale(0);
  border-top: 2.5px solid ${({ theme }) => theme.colors.lightGreen10};
  background: ${({ theme }) =>
    `linear-gradient(to bottom, transparent 5%, ${theme.colors.lightGreen10} 25%, ${theme.colors.green})`};
  overflow: auto;

  ${({ active }) =>
    active &&
    `transform: scale(1); transform-origin: bottom; transition: transform 0.8s ease-in`}
`;

const Index = () => {
  const initialRender = useRef(true);
  const boundingBoxRef = useRef<HTMLDivElement>(null);
  const [seeds, setSeeds] = useState<string[]>([]);
  const [filters, setFilters] = useState({});

  const [recommend, { data, loading }] = useRecommendationsLazyQuery();

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      recommend({ variables: { seeds, filters } });
    }
  }, [seeds, filters]);

  useEffect(() => {
    recommend({ variables: { seeds, filters } });
  }, [seeds, filters]);

  return (
    <Layout>
      <div ref={boundingBoxRef} style={{ height: '100vh', overflow: 'scroll' }}>
        <SearchBar>
          <SearchSelect onUpdateSeeds={(updated) => setSeeds(updated)} />
        </SearchBar>
        <ResultsContainer active={!!data?.recommendations}>
          <SearchResults tracks={data?.recommendations} />
          <AudioFilters
            onChange={(filter) => setFilters({ ...filters, ...filter })}
          />
        </ResultsContainer>
      </div>
    </Layout>
  );
};

export default Index;
