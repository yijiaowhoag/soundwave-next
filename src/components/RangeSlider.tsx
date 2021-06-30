import { useState, useRef } from 'react';
import styled from 'styled-components';

const Slider = styled.div`
  position: relative;

  .slider__track {
  }

  input {
    width: 100%;
  }
`;

interface IProps {
  label: string;
  value?: number;
  onChange?: () => void;
}

const RangeSlider: React.FunctionComponent<IProps> = ({
  label,
  value,
  onChange,
}) => {
  const minRef = useRef();
  const maxRef = useRef();

  const [minVal, setMinVal] = useState<number>(0);
  const [maxVal, setMaxVal] = useState<number>(10);

  const handleMouseDown = (e) => {
    console.log('handleMouseMove event', e);
  };

  return (
    <Slider>
      <div className="slider__track">
        <input type="range" onMouseDown={handleMouseDown} />
      </div>
      <div className="slider__range"></div>
    </Slider>
  );
};

export default RangeSlider;
