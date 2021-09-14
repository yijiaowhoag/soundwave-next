import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSearch } from '../graphql/queries';
import useDebounce from '../hooks/useDebounce';
import { Field } from '../components/Input';
import Playlist from '../components/Playlist';
import AudioFilters from '../components/AudioFilters';

const Container = styled.main`
  width: 100vw;
  height: 100vh;
  padding: ${({ theme }) => theme.columns(0.5)};
  background-color: ${({ theme }) => theme.colors.darkest};
  color: white;

  > div {
    display: flex;
  }
`;

const SearchInput = styled(Field)``;

const Main = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 80vw;
  padding-top: 10vh;
  padding-bottom: 10vh;
`;

const Sidebar = styled.div`
  right: 0;
  width: 560px;
  padding: 2rem 1rem;
  background-color: ${({ theme }) => theme.colors.darkGreen};
`;

const Search: React.FC<any> = ({ fetchResults }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      console.log('debouncedSearchTerm changed', debouncedSearchTerm);

      fetchResults(searchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <SearchInput
      placeholder="Search by Track"
      value={searchTerm}
      onChange={handleChange}
    />
  );
};

export default () => {
  const [search, { loading, data: searchData }] = useSearch();

  return (
    <Container>
      <Search
        fetchResults={(searchTerm: string) =>
          search({ variables: { query: searchTerm.trim() } })
        }
      />
      <div>
        <Main>
          <h1>Search Results</h1>
          {loading && <p>Loading...</p>}
          {searchData && <Playlist tracks={searchData.search} keyName="uri" />}
        </Main>
        <Sidebar>
          <AudioFilters />
        </Sidebar>
      </div>
    </Container>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const user = await getAuthSession(context.req);

  if (!user) {
  }

  return { props: { user } };
};

