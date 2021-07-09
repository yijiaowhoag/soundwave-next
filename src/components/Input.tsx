import { useState } from 'react';
import styled from 'styled-components';

export const Field = styled.input`
  width: 100%;
  margin-bottom: 24px;
  border: none;
  border-bottom: 2px solid white;
  padding: 0.5rem;
  padding-left: 0;
  background-color: transparent;
  color: white;
  font-size: 16px;

  &::placeholder {
    color: white;
  }

  &:focus {
    outline: none;
  }
`;

interface FieldProps {
  initialValue: string | number | string[] | undefined;
  placeholder?: string;
  onChange?: React.ChangeEventHandler;
}

export const useInput = (initialValue: any) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  const reset = () => setValue('');

  return [value, handleChange, reset];
};

const Input: React.FC<FieldProps> = (props) => {
  const [value, handleChange] = useInput(props.initialValue);

  return <Field value={value} onChange={handleChange} {...props} />;
};

export default Input;
