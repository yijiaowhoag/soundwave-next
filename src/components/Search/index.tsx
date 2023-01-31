import { useState, useEffect } from 'react';
import useDebounce from '../../hooks/useDebounce';

interface SearchInputProps {
  fetchResults: (query: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ fetchResults }) => {
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
    <input
      placeholder="Search by Track"
      value={searchTerm}
      onChange={handleChange}
    />
  );
};

export default SearchInput;
