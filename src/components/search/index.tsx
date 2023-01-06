import { useState, useEffect } from 'react';
import styled from 'styled-components';
import useDebounce from '../../hooks/useDebounce';

interface SearchProps {
  fetchResults: (query: string) => void;
}

const SearchInput = styled.input``;

const Search: React.FC<SearchProps> = ({ fetchResults }) => {
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

export default Search;
