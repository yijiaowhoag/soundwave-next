import styled from 'styled-components';
import { Formik, Form, FormikHelpers } from 'formik';
import isEqual from 'lodash.isequal';
import {
  useCreateSessionMutation,
  SessionsDocument,
  UpdateSessionInput,
  useUpdateSessionMutation,
} from '../../__generated__/types';
import { FillButton } from '../shared/Button';
import InputField from '../shared/InputField';
import CoverField from './CoverField';
import useUploadFile from '../../hooks/useUploadFile';

const FormContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
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
    display: flex;
    flex-direction: column;

    > div {
      display: flex;
      height: 12rem;
    }
  }
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  width: ${({ theme }) => theme.columns(2.5)};
  margin-left: 1rem;
`;

const SaveBtn = styled(FillButton)`
  align-self: flex-end;
  margin-top: 1rem;
`;

type FieldName = 'avatar' | 'cover';
interface SessionFormProps {
  sessionId?: string;
  initialValues?: SessionFormValues;
  onClose: () => void;
}

type SessionFormValues = {
  name: string;
  description?: string;
} & {
  [key in FieldName]?: string;
};

const SessionForm: React.FC<SessionFormProps> = ({
  sessionId,
  initialValues = {
    name: '',
    description: '',
    cover: null,
  },
  onClose,
}) => {
  const { uploadFile, uploadProgress, file, setFile } = useUploadFile();
  const [createSession] = useCreateSessionMutation({
    refetchQueries: [
      { query: SessionsDocument, variables: { isRefetch: true } },
    ],
  });
  const [updateSession] = useUpdateSessionMutation();

  const validate = (values: SessionFormValues) => {
    let errors: Partial<SessionFormValues> = {};

    if (!values.name) {
      errors.name = 'Session name is required.';
    }

    return errors;
  };

  const handleSubmit = async (
    values: SessionFormValues,
    actions: FormikHelpers<SessionFormValues>
  ) => {
    const dirtyFields: Partial<UpdateSessionInput> = Object.entries(
      values
    ).reduce(
      (acc, [key, value]) =>
        !isEqual(value, initialValues[key])
          ? {
              ...acc,
              [key]: value,
            }
          : acc,
      {}
    );

    if (file) {
      await uploadFile({
        fieldName: 'cover',
        initialValues: { cover: initialValues.cover } as Record<
          FieldName,
          string
        >,
        setFieldValue: actions.setFieldValue,
      });
      dirtyFields['cover'] = file.name;
    }

    if (sessionId) {
      await updateSession({ variables: { sessionId, updates: dirtyFields } });
    } else {
      await createSession({ variables: { ...values } });
    }
    actions.setSubmitting(false);
    onClose();
  };

  return (
    <FormContainer>
      <h2>Edit Details</h2>
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <CoverField
                name="cover"
                setFile={setFile}
                imageStyles={{ width: '12rem' }}
              />
              <Group>
                <InputField
                  label="Name"
                  name="name"
                  placeholder="Session Name"
                />
                <InputField
                  fieldGroupStyles={{
                    flex: 1,
                    marginBottom: 0,
                  }}
                  label="Description"
                  name="description"
                  placeholder="Add an optional description"
                  textarea
                />
              </Group>
            </div>
            <SaveBtn type="submit">
              {isSubmitting ? 'Saving...' : 'Save'}
            </SaveBtn>
          </Form>
        )}
      </Formik>
    </FormContainer>
  );
};

export default SessionForm;
