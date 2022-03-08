import styled, { css } from 'styled-components';
import { useField } from 'formik';

const FieldGroup = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const FieldLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(1rem, -50%);
  font-size: 14px;
  line-height: 18px;
  opacity: 0;

  &:before {
    content: '';
    position: absolute;
    bottom: 50%;
    left: -0.25rem;
    right: -0.25rem;
    z-index: -1;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.darkGreen};
  }
`;

const fieldStyles = css`
  width: 100%;
  border-radius: 6px;
  border: none;
  padding: 0.8rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-family: inherit;
  font-size: 16px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: 1px solid rgba(255, 255, 255, 0.3);

    ~ ${FieldLabel} {
      opacity: 1;
    }
  }
`;

const TextInput = styled.input`
  ${fieldStyles}
`;

const Textarea = styled.textarea`
  height: 10rem;
  resize: none;
  ${fieldStyles}
`;

const FieldError = styled.p`
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
  padding-left: 0;
  font-size: 13.5px;
  color: ${({ theme }) => theme.colors.error};

  &:before {
    content: '';
    width: 12px;
    height: 1.5px;
    margin-right: 0.25rem;
    background-color: ${({ theme }) => theme.colors.error};
  }
`;

type InputFieldProps = React.InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement
> & {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({
  textarea,
  label,
  ...props
}) => {
  const [field, meta] = useField(props);

  return (
    <FieldGroup>
      {textarea ? (
        <Textarea {...field} {...props} />
      ) : (
        <TextInput autoComplete="off" {...field} {...props} />
      )}
      <FieldLabel htmlFor={props.name}>{label}</FieldLabel>
      {meta.touched && meta.error && <FieldError>{meta.error}</FieldError>}
    </FieldGroup>
  );
};

export default InputField;
