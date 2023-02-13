import { useState } from 'react';
import { SearchType, useAddSearchMutation } from '../../__generated__/types';
import CustomAsynceSelect from './CustomAsyncSelect';
import type { ActionMeta } from 'react-select';
import type { OptionType } from './Option';

interface SearchSelectProps {
  onUpdateSeeds: (seeds: string[]) => void;
}

const SearchSelect: React.FC<SearchSelectProps> = ({ onUpdateSeeds }) => {
  const [selected, setSelected] = useState<readonly OptionType[]>([]);
  const [addSearch] = useAddSearchMutation();

  const handleSelectChange = (
    values: readonly OptionType[],
    actionMeta?: ActionMeta<OptionType>
  ) => {
    if (actionMeta?.action === 'select-option') {
      const { value, label, imageUrl } = actionMeta.option;
      addSearch({
        variables: {
          seed: { id: value, name: label, type: SearchType.Track, imageUrl },
        },
      });
    }
    setSelected(values);
    onUpdateSeeds(values.map((v) => v.value));
  };

  return (
    <CustomAsynceSelect
      onChange={handleSelectChange}
      value={selected}
      isMulti
    />
  );
};

export default SearchSelect;
