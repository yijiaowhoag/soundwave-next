import { useState, useCallback } from 'react';
import CustomAsynceSelect from './CustomAsyncSelect';
import type { OptionType } from './Option';

interface SearchSelectProps {
  onUpdateSeeds: (seeds: string[]) => void;
}

const SearchSelect: React.FC<SearchSelectProps> = ({ onUpdateSeeds }) => {
  const [selected, setSelected] = useState<readonly OptionType[]>([]);

  const handleSelectChange = (values: readonly OptionType[]) => {
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
