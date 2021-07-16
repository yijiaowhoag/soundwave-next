import { useState } from 'react';
import { useApolloClient } from '@apollo/client';
import Select, { components } from 'react-select';
import AsyncSelect from 'react-select/async';
import debounce from 'debounce-promise';
import { FaSearch } from 'react-icons/fa';
import { SEARCH } from '../graphql/queries';

const Dropdown: React.FC = () => {
  const client = useApolloClient();
  const [searchResults, setSearchResults] = useState([]);
  const [seeds, setSeeds] = useState([]);

  const getAsyncOptions = async (inputValue: string): Promise<any> => {
    return client
      .query({
        query: SEARCH,
        variables: { searchTerm: inputValue.trim() },
      })
      .then((res) =>
        res.data
          ? res.data.search.map((d) => ({
              label: d.name,
              value: d.id,
              artist: d.artists
                .reduce((acc, curr) => [...acc, curr.name], [])
                .join(', '),
              imageUrl: d.images.find((image) => image.height === 300)?.url,
            }))
          : []
      );
  };

  const loadOptions = (inputValue: string) => getAsyncOptions(inputValue);
  const debouncedLoadOptions = debounce(loadOptions, 1000);

  const handleSelect = (selectedOption) => {
    setSeeds({ selectedOption });
  };

  const formatOptionLabel = ({ value, label, artist, imageUrl }) => (
    <div style={{ display: 'flex' }}>
      <div style={{ width: 60, height: 60, marginRight: 10 }}>
        <img src={imageUrl} style={{ width: '100%', height: '100%' }} />
      </div>
      <h5>
        <span>{label}</span> - <span>{artist}</span>
      </h5>
    </div>
  );

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? 0 : 0,
      boxShadow: state.isFocused ? 0 : 0,
      cursor: 'text',
      borderRadius: 0,
      borderBottom: 'solid 1px',
      backgroundColor: 'transparent',
    }),

    option: (provided, { isFocused }) => {
      return {
        ...provided,
        cursor: 'pointer',
        backgroundColor: isFocused ? 'white' : 'white',
        color: isFocused ? 'rgba(255, 80, 86)' : 'black',
        lineHeight: 2,
      };
    },

    input: () => ({
      color: 'white',
    }),
  };

  const DropdownIndicator = ({ children, ...rest }) => (
    <components.DropdownIndicator {...rest}>
      <FaSearch />
    </components.DropdownIndicator>
  );

  return (
    <>
      <AsyncSelect
        cacheOptions
        loadOptions={debouncedLoadOptions}
        isMulti={true}
        formatOptionLabel={formatOptionLabel}
        onChange={handleSelect}
        placeholder="Search by Track"
        classNamePrefix="select"
        styles={customStyles}
        components={{ DropdownIndicator }}
      />
      <div>{JSON.stringify(seeds)}</div>
    </>
  );
};

export default Dropdown;
