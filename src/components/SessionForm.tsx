import styled from 'styled-components';
import Button from './Button';
import { Field, useInput } from './Input';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 280px;
  height: 320px;
  padding: 2rem;
  border-radius: 24px;
`;

const SessionForm: React.FC<any> = ({ onSubmit }) => {
  const [value, handleChange, reset] = useInput('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ variables: { sessionName: value } });
    reset();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>New Session</h2>
      <Field placeholder="Session Name" value={value} onChange={handleChange} />
      <Button type="submit">Create</Button>
    </Form>
  );
};

export default SessionForm;
