import { components, OptionProps } from 'react-select';

export type OptionType = {
  value: string;
  label: string;
  artist: string;
  imageUrl: string;
};

const Option = (props: OptionProps<OptionType>) => (
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

export default Option;
