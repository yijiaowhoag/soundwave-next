import { useState, useCallback } from 'react';
import styled from 'styled-components';
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
import { SearchDocument, Track } from '../../__generated__/types';
import theme from '../../theme';

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

const SelectedContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  padding-left: 1rem;
`;

const Selected = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  min-width: 10rem;
  max-width: 20rem;
  margin-right: 10px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.lightGreen};
  font-weight: bold;
  font-size: 18px;

  .image-container {
    position: relative;
    width: 45px;
    height: 45px;

    .image-overlay {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      border-radius: 5px 0 0 5px;
      background: ${({ theme }) =>
        `linear-gradient(45deg, ${theme.colors.spotifyGreen}, ${theme.colors.lightGreen30})`};
      opacity: 0.7;
    }

    img {
      width: 100%;
      height: 100%;
      border-radius: 5px 0 0 5px;
    }
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const customStyles: StylesConfig<Option> = {
  container: (base) => ({
    ...base,
    width: '100%',
    padding: '0 1rem',
    marginBottom: '1rem',
  }),

  control: (base) => ({
    ...base,
    height: '15vw',
    cursor: 'text',
    border: 0,
    borderRadius: 0,
    boxShadow: 'none',
    fontWeight: 'bold',
    fontSize: 72,
  }),

  menu: (base) => ({
    ...base,
    border: `1.5px solid ${theme.colors.lightGreen}`,
  }),

  multiValue: (base) => ({
    ...base,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    margin: 0,
    borderRadius: '0 5px 5px 0',
  }),

  multiValueLabel: (base) => ({
    ...base,
    maxWidth: '10rem',
    textOverflow: 'ellipsis',
  }),

  multiValueRemove: (base) => ({
    ...base,
    height: '100%',
    cursor: 'pointer',
    ':hover': { backgroundColor: theme.colors.darkGreen30 },
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
        Container: (props) => (
          <Selected>
            <div className="image-container">
              <div className="image-overlay" />
              <img src={opt.imageUrl} />
            </div>
            <components.MultiValueContainer
              {...props}
            ></components.MultiValueContainer>
          </Selected>
        ),
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
    <SelectedContainer>{props.getValue().map(renderValue)}</SelectedContainer>
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
      {children}
      <CustomValueContainer {...commonProps} />
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
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null,
        SelectContainer,
        Option,
      }}
      controlShouldRenderValue={false}
      isClearable={false}
      isMulti
      loadOptions={debouncedLoadOptions}
      menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
      onChange={handleChange}
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
  );
};

export default Search;
