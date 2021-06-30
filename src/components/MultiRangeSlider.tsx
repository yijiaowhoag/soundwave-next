import 'react-input-range/lib/css/index.css';
import React from 'react';
import styled from 'styled-components';
import InputRange, { Range } from 'react-input-range';

const Block = styled.div`
  margin-bottom: 1rem;

  label {
    margin-bottom: 1.5rem;
    font-size: 14px;
  }

  .input-range {
    margin-top: 2rem;
  }

  .input-range__label {
    font-size: 12px;
  }

  .input-range__track {
    height: 0.15rem;
    background-color: ${({ theme }) => theme.colors.lightGreen30};
  }

  .input-range__track--active {
    background-color: ${({ theme }) => theme.colors.lightGreen};
  }

  .input-range__slider {
    border: none;
    background-color: ${({ theme }) => theme.colors.lightGreen};
  }

  .input-range__label--min,
  .input-range__label--max {
    display: none;
  }
`;

interface MultiRangeSliderProps {
  name: string;
  minValue: number;
  maxValue: number;
  onUpdate: ({ name, value }: { name: string; value: Range | number }) => void;
}

interface MultiRangeState {
  value: Range | number;
}

class MultiRangeSlider extends React.Component<
  MultiRangeSliderProps,
  MultiRangeState
> {
  constructor(props: MultiRangeSliderProps) {
    super(props);

    this.state = {
      value: { min: 0 * 100, max: 1 * 100 },
    };
  }

  handleChange = (value: Range | number) => {
    this.props.onUpdate({ name: this.props.name, value. });
  };

  render() {
    return (
      <Block>
        <label>{this.props.name}</label>
        <InputRange
          allowSameValues={true}
          draggableTrack={true}
          formatLabel={(value) => `${value / 100}`}
          minValue={this.props.minValue}
          maxValue={this.props.maxValue}
          name={this.props.name}
          onChange={(value) => this.setState({ value })}
          onChangeComplete={this.handleChange}
          value={this.state.value}
        />
      </Block>
    );
  }
}

export default MultiRangeSlider;
