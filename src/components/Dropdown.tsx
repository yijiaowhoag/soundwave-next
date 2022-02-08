import { useApolloClient } from '@apollo/client';
import {
  components,
  StylesConfig,
  DropdownIndicatorProps,
  MultiValueGenericProps,
  OptionProps,
} from 'react-select';
import AsyncSelect from 'react-select/async';
import debounce from 'debounce-promise';
import { FaSearch } from 'react-icons/fa';
import { SearchDocument } from '../generated/graphql';
import theme from '../theme';

type Option = {
  value: string;
  label: string;
  artist: string;
  imageUrl: string;
};

interface DropdownProps {
  seeds: object[];
  onUpdateSeeds: (seeds: object[]) => void;
}

const DropdownIndicator = (props: DropdownIndicatorProps<any>) => (
  <components.DropdownIndicator {...props}>
    <FaSearch />
  </components.DropdownIndicator>
);

const MultiValueLabel = (props: MultiValueGenericProps<any>) => (
  <components.MultiValueLabel {...props}>
    <span>{props.data.label}</span>
  </components.MultiValueLabel>
);

const Option = (props: OptionProps<any>) => (
  <components.Option {...props}>
    <div style={{ display: 'flex' }}>
      <div style={{ width: 60, height: 60, marginRight: 10 }}>
        <img
          src={props.data.imageUrl}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <h5>
        <span>{props.data.label}</span> - <span>{props.data.artist}</span>
      </h5>
    </div>
  </components.Option>
);

const Dropdown: React.FC<DropdownProps> = ({ seeds, onUpdateSeeds }) => {
  const client = useApolloClient();

  const getAsyncOptions = async (inputValue: string): Promise<any> => {
    return client
      .query({
        query: SearchDocument,
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

  const customStyles: StylesConfig = {
    control: (base) => ({
      ...base,
      cursor: 'text',
      border: 0,
      borderBottom: '1px solid',
      borderRadius: 0,
      boxShadow: 'none',
      backgroundColor: 'transparent',
    }),

    input: (base) => ({ ...base, color: 'white' }),

    multiValue: (base) => ({
      ...base,
      borderRadius: 20,
      backgroundColor: theme.colors.lightGreen,
      color: 'white',
    }),

    option: (base, { isFocused }) => ({
      ...base,
      cursor: 'pointer',
      backgroundColor: isFocused
        ? theme.colors.lightGreen
        : theme.colors.darkGreen,
      color: theme.colors.light,
    }),
  };

  return (
    <>
      <AsyncSelect
        isMulti
        cacheOptions
        loadOptions={debouncedLoadOptions}
        placeholder="Search by Track"
        components={{
          DropdownIndicator,
          MultiValueLabel,
          Option,
        }}
        styles={customStyles}
      />
      <div>{JSON.stringify(seeds)}</div>
    </>
  );
};

export default Dropdown;
