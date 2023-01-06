import 'react-input-range/lib/css/index.css';
import React from 'react';
import styled from 'styled-components';
import InputRange, { Range } from 'react-input-range';

const InputRangeBlock = styled.div`
  margin-bottom: 1.2em;

  label span:first-child {
    font-weight: bold;
    text-transform: capitalize;
  }

  .input-range {
    margin-top: 1em;
  }

  .input-range__track {
    height: 0.15rem;
    background-color: ${({ theme }) => theme.colors.lightGreen30};
  }

  .input-range__track--active {
    background: ${({ theme }) =>
      `linear-gradient(135deg, ${theme.colors.purple}, ${theme.colors.spotifyGreen}, ${theme.colors.lightGreen})`};
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

interface InputRangeProps {
  minValue: number;
  maxValue: number;
  step: number;
  name: string;
  onChange: ({ name, value }: { name: string; value: number | Range }) => void;
}

interface InputRangeState {
  value: number | Range;
}

class MultiRangeSlider extends React.Component<
  InputRangeProps,
  InputRangeState
> {
  constructor(props: InputRangeProps) {
    super(props);

    this.state = { value: 0 };
  }

  render() {
    const { minValue, maxValue, step, name, onChange } = this.props;

    return (
      <InputRangeBlock>
        {typeof this.state.value === 'number' && (
          <label>
            <span>{this.props.name}</span>
            <span>&nbsp;=&nbsp;</span>
            <span>{this.state.value.toFixed(2)}</span>
          </label>
        )}
        <InputRange
          allowSameValues
          draggableTrack
          formatLabel={() => ''}
          minValue={minValue}
          maxValue={maxValue}
          step={step}
          name={name}
          value={this.state.value}
          onChange={(value) => this.setState({ value })}
          onChangeComplete={(value) => onChange({ name, value })}
        />
      </InputRangeBlock>
    );
  }
}

export default MultiRangeSlider;
