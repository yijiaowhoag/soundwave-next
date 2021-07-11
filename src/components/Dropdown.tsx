import { useState } from 'react';
import Select, { components } from 'react-select';
import AsyncSelect from 'react-select/async';
import { debounce } from 'lodash';
import { FaSearch } from 'react-icons/fa';
import { useSearch } from '../graphql/queries';

const Dropdown: React.FC = () => {
  const [search, { loading, data: searchData }] = useSearch();
  const [seeds, setSeeds] = useState([]);

  const fetch = (inputValue) => {
    search({ variables: { query: inputValue.trim() } });
  };

  const debouncedFetch = debounce(fetch, 1000);

  const handleSelect = (selectedOption) => {
    setSeeds({ selectedOption });
  };

  const dropdownOptions =
    searchData &&
    searchData.search.map(({ id, name }) => ({ label: name, value: id }));

  // const dropdownOptions = [
  //   { label: 'Shark', value: 'Shark' },
  //   { label: 'Dolphin', value: 'Dolphin' },
  //   { label: 'Whale', value: 'Whale' },
  //   { label: 'Octopus', value: 'Octopus' },
  //   { label: 'Crab', value: 'Crab' },
  //   { label: 'Lobster', value: 'Lobster' },
  // ];

  const customStyles = {
    control: (base, state) => ({
      ...base,
      border: state.isFocused ? 0 : 0,
      boxShadow: state.isFocused ? 0 : 0,
      cursor: 'text',
      borderRadius: 0,
      borderBottom: 'solid 1px',
      backgroundColor: 'transparent',
    }),

    option: (styles, { isFocused }) => {
      return {
        ...styles,
        cursor: 'pointer',
        backgroundColor: isFocused ? 'white' : 'white',
        color: isFocused ? 'rgba(255, 80, 86)' : 'black',
        lineHeight: 2,
      };
    },
  };

  const DropdownIndicator = ({ children, ...rest }) => (
    <components.DropdownIndicator {...rest}>
      <FaSearch />
    </components.DropdownIndicator>
  );

  return (
    <AsyncSelect
      loadOptions={debouncedFetch}
      onChange={handleSelect}
      placeholder="Search by Track"
      classNamePrefix="select"
      styles={customStyles}
      components={{ DropdownIndicator }}
    />
  );
};

export default Dropdown;
