import styled from 'styled-components';
import { useApolloClient } from '@apollo/client';
import debounce from 'debounce-promise';
import AsyncSelect from 'react-select/async';
import type {
  MultiValue,
  StylesConfig,
  OnChangeValue,
  OptionsOrGroups,
  GroupBase,
} from 'react-select';
import {
  useRemoveSearchMutation,
  SearchDocument,
  Track,
} from '../../__generated__/types';
import CustomValue from './CustomValue';
import Option from './Option';
import type { OptionType } from './Option';
import theme from '../../theme';

const SearchSelectContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const ValuesContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  padding-left: 2.5rem;
`;

const customStyles: StylesConfig<OptionType> = {
  container: (base) => ({
    ...base,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  }),

  control: (base) => ({
    ...base,
    width: `${theme.columns(7)}`,
    maxWidth: `calc(100% - 320px)`,
    height: '15vw',
    cursor: 'text',
    border: 0,
    borderRadius: 0,
    boxShadow: 'none',
    paddingLeft: '2rem',
    fontWeight: 'bold',
    fontSize: 72,
  }),

  menu: (base) => ({
    ...base,
    left: '2.5rem',
    width: 'calc(100% - 2.5rem)',
    marginTop: 0,
    border: `1.5px solid ${theme.colors.lightGreen}`,
    borderRadius: 0,
  }),

  option: (base) => ({
    ...base,
    cursor: 'pointer',
    border: 0,
    color: 'white',
  }),

  placeholder: (base) => ({
    ...base,
    fontWeight: 'bold',
    fontSize: 72,
    opacity: 0.5,
  }),

  valueContainer: (base) => ({
    ...base,
    padding: 0,
  }),
};

interface CustomAsyncSelectProps {
  isMulti: boolean;
  value: MultiValue<OptionType>;
  onChange: (value: OnChangeValue<OptionType, true>) => void;
}

const CustomAsyncSelect: React.FC<CustomAsyncSelectProps> = ({
  isMulti,
  value,
  onChange,
}) => {
  const client = useApolloClient();
  const [removeSearch] = useRemoveSearchMutation();

  const getAsyncOptions = async (
    inputValue: string
  ): Promise<OptionsOrGroups<OptionType, GroupBase<OptionType>>> => {
    return client
      .query({
        query: SearchDocument,
        variables: { searchTerm: inputValue.trim() },
      })
      .then((res) =>
        res.data
          ? res.data.search.map((d: Track) => ({
              label: d.name,
              value: d.id,
              artist: d.artists
                .reduce<string[]>((acc, curr) => [...acc, curr.name], [])
                .join(', '),
              imageUrl: d.album.images.find((image) => image.height === 300)
                ?.url,
            }))
          : []
      );
  };

  const loadOptions = (inputValue: string) => getAsyncOptions(inputValue);
  const debouncedLoadOptions = debounce(loadOptions, 1000);

  const handleRemoveValue = (removedValue: OptionType) => {
    removeSearch({
      variables: {
        searchId: removedValue.value,
      },
    });
    onChange(value.filter((v) => v.value !== removedValue.value));
  };

  return (
    <SearchSelectContainer>
      <ValuesContainer>
        {isMulti
          ? value.map((v) => (
              <CustomValue
                key={v.value}
                selected={v}
                onRemoveValue={handleRemoveValue}
              />
            ))
          : null}
      </ValuesContainer>
      <AsyncSelect
        instanceId="async-select"
        cacheOptions
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
          Option,
        }}
        controlShouldRenderValue={false}
        isClearable={false}
        isMulti={isMulti}
        value={value}
        onChange={onChange}
        loadOptions={debouncedLoadOptions}
        menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
        openMenuOnClick={false}
        placeholder="Type your search..."
        styles={customStyles}
        theme={(baseTheme) => ({
          ...baseTheme,
          colors: {
            ...baseTheme.colors,
            neutral0: theme.colors.darkGreen,
            neutral10: theme.colors.lightGreen,
            neutral80: 'white',
            primary: theme.colors.lightGreen,
            primary25: theme.colors.lightGreen,
          },
        })}
      />
    </SearchSelectContainer>
  );
};

export default CustomAsyncSelect;
