import { useState, useCallback } from 'react';
import { useApolloClient } from '@apollo/client';
import {
  components,
  ActionMeta,
  ContainerProps,
  MultiValue,
  MultiValueProps,
  OptionProps,
  StylesConfig,
  SingleValue,
} from 'react-select';
import AsyncSelect from 'react-select/async';
import debounce from 'debounce-promise';
import { FaSearch } from 'react-icons/fa';
import { SearchDocument, Track } from '../generated/graphql';
import theme from '../theme';

interface SearchSelectProps {
  seeds: object[];
  onUpdateSeeds: (seeds: string[]) => void;
}

type Option = {
  value: string;
  label: string;
  artist: string;
  imageUrl: string;
};

const customStyles: StylesConfig<Option> = {
  container: (base) => ({
    ...base,
    width: '100%',
  }),

  control: (base) => ({
    ...base,
    cursor: 'text',
    border: 0,
    borderRadius: 0,
    boxShadow: 'none',
  }),

  dropdownIndicator: (base) => ({
    ...base,
    cursor: 'pointer',
    padding: '0.75rem',
  }),

  menu: (base) => ({
    ...base,
    border: `1.5px solid ${theme.colors.lightGreen}`,
  }),

  multiValue: (base) => ({
    ...base,
    borderRadius: 10,
  }),

  multiValueRemove: (base, { isFocused }) => ({
    ...base,
    cursor: 'pointer',
    backgroundColor: 'transparent',
  }),

  option: (base) => ({
    ...base,
    cursor: 'pointer',
    border: 0,
    color: 'white',
  }),
};

const CustomValueContainer = (props: MultiValueProps<Option>) => {
  const { formatOptionLabel, getOptionValue, isDisabled, onChange } =
    props.selectProps;

  const getValueLabel = (opt: Option) =>
    formatOptionLabel?.(opt, 'value') || opt.label;
  const getKey = (opt: Option, index: number) =>
    `${getOptionValue(opt)}-${index}`;

  const handleRemove = (opt: Option) => {
    onChange(
      props.getValue().filter((v) => v.value !== opt.value),
      { action: 'remove-value', removedValue: opt }
    );
  };

  const renderValue = (opt: Option, index: number) => (
    <components.MultiValue
      {...props}
      components={{
        Container: components.MultiValueContainer,
        Label: components.MultiValueLabel,
        Remove: components.MultiValueRemove,
      }}
      isDisabled={isDisabled}
      key={getKey(opt, index)}
      index={index}
      removeProps={{
        onClick: () => handleRemove(opt),
        onTouchEnd: () => handleRemove(opt),
        onMouseDown: (e) => {
          e.preventDefault();
          e.stopPropagation();
        },
      }}
      data={opt}
    >
      {getValueLabel(opt)}
    </components.MultiValue>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexFlow: 'row wrap',
      }}
    >
      {props.getValue().map(renderValue)}
    </div>
  );
};

const SelectContainer = ({
  children,
  innerProps,
  isDisabled,
  isFocused,
  ...commonProps
}: ContainerProps<Option>) => {
  const selectContainerProps = {
    ...commonProps,
  };

  return (
    <components.SelectContainer
      innerProps={innerProps}
      isDisabled={isDisabled}
      isFocused={isFocused}
      {...selectContainerProps}
    >
      <CustomValueContainer {...commonProps} />
      {children}
    </components.SelectContainer>
  );
};

const Option = (props: OptionProps<Option>) => (
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

const Search: React.FC<SearchSelectProps> = ({ seeds, onUpdateSeeds }) => {
  const client = useApolloClient();
  const [value, setValue] = useState<
    MultiValue<Option> | SingleValue<Option>
  >();

  const handleChange = useCallback(
    (
      opt: MultiValue<Option> | SingleValue<Option>,
      actionMeta: ActionMeta<Option>
    ): void => {
      setValue(opt);
      onUpdateSeeds(opt.map((o) => o.value));
    },
    []
  );

  const getAsyncOptions = async (inputValue: string): Promise<any> => {
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
              imageUrl: d.images.find((image) => image.height === 300)?.url,
            }))
          : []
      );
  };

  const loadOptions = (inputValue: string) => getAsyncOptions(inputValue);
  const debouncedLoadOptions = debounce(loadOptions, 1000);

  return (
    <AsyncSelect
      cacheOptions
      components={{
        DropdownIndicator: (props) => (
          <components.DropdownIndicator {...props}>
            <FaSearch />
          </components.DropdownIndicator>
        ),
        IndicatorSeparator: () => null,
        SelectContainer,
        Option,
      }}
      controlShouldRenderValue={false}
      defaultOptions
      isMulti
      loadOptions={debouncedLoadOptions}
      menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
      value={value}
      onChange={handleChange}
      placeholder="Search by Track"
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
  );
};

export default Search;
