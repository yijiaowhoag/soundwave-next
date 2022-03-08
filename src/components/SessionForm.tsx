import styled from 'styled-components';
import { Formik, Form } from 'formik';
import {
  useCreateSessionMutation,
  SessionsDocument,
} from '../generated/graphql';
import { FillButton } from './Button';
import InputField from './InputField';

interface SessionFormProps {
  onClose: () => void;
}

interface Values {
  name: string;
  description?: string;
}

const FormContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: ${({ theme }) => theme.columns(3)};
  padding: 1.5rem;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.darkGreen};
  color: white;

  h2 {
    margin: 0;
    margin-bottom: 2rem;
  }

  form {
    width: 100%;
  }
`;

const SessionForm: React.FC<SessionFormProps> = ({ onClose }) => {
  const [createSession] = useCreateSessionMutation({
    refetchQueries: [
      { query: SessionsDocument, variables: { isRefetch: true } },
    ],
  });

  const validate = (values: Values) => {
    let errors: Partial<Values> = {};

    if (!values.name) {
      errors.name = 'Session name is required.';
    }

    return errors;
  };
  return (
    <FormContainer>
      <h2>New Session</h2>
      <Formik
        initialValues={{ name: '', description: '' }}
        validate={validate}
        onSubmit={async (values, actions) => {
          await createSession({ variables: { ...values } });
          actions.setSubmitting(false);
          actions.resetForm({ values: { name: '', description: '' } });
          onClose();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField label="Name" name="name" placeholder="Session Name" />
            <InputField
              label="Description"
              name="description"
              placeholder="Add an optional description"
              textarea
            />
            <FillButton type="submit">
              {isSubmitting ? 'Saving...' : 'Save'}
            </FillButton>
          </Form>
        )}
      </Formik>
    </FormContainer>
  );
};

export default SessionForm;
