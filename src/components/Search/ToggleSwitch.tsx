import { useState, useEffect } from 'react';
import styled from 'styled-components';

interface ToggleSwitchProps {
  defaultState: string | number | boolean;
  altState: string | number | boolean;
  onToggle?: (val: string | number | boolean) => void;
}

const Toggle = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ToggleLabel = styled.span<{ active: boolean }>`
  font-weight: bold;
  color: ${({ active, theme }) =>
    active ? theme.colors.lightGreen : theme.colors.light};
`;

const Switch = styled.span`
  position: relative;
  width: 4rem;
  height: calc(1.6rem + 6px);
  margin: auto 0.8rem;
  border-radius: 2rem;
  background-color: slategray;
`;

const Handle = styled.span`
  position: absolute;
  top: 3px;
  right: 3px;
  transition: all 0.3s ease-in;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 100%;
  background-color: ${({ theme }) => theme.colors.lightGreen};
`;

const Checkbox = styled.input`
  display: none;

  &:checked + ${Switch} > ${Handle} {
    transform: translateX(calc(-4rem + 1.6rem + 6px));
    transition: all 0.3s ease-in;
  }
`;

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  defaultState,
  altState,
  onToggle,
}) => {
  const [val, setVal] = useState(defaultState);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    console.log('checked?', e.target.checked);
    if (val === defaultState) {
      setVal(altState);
    } else {
      setVal(defaultState);
    }
  };

  useEffect(() => {
    onToggle && onToggle(val);
  }, [val]);

  return (
    <Toggle htmlFor="switch">
      <ToggleLabel active={val === defaultState}>{defaultState}</ToggleLabel>
      <Checkbox
        type="checkbox"
        id="switch"
        name="switch"
        role="switch"
        checked={val === defaultState}
        onChange={handleChange}
      />
      <Switch>
        <Handle />
      </Switch>
      <ToggleLabel active={val === altState}>{altState}</ToggleLabel>
    </Toggle>
  );
};

export default ToggleSwitch;
