import { useState } from 'react';
import styled from 'styled-components';
import { Formik, Form, FormikHelpers } from 'formik';
import isEqual from 'lodash.isequal';
import {
  useUpdateCurrUserMutation,
  UpdateUserInput,
} from '../../__generated__/types';
import InputField from '../shared/InputField';
import AvatarField from './AvatarField';
import { FillButton } from '../shared/Button';
import useUploadFile, { FieldName } from '../../hooks/useUploadFile';

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
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }
`;

interface ProfileFormProps {
  initialValues: {
    avatar: string | null;
    display_name: string;
    email: string;
  };
  onClose: () => void;
}

type ProfileFormValues = {
  avatar: string | null;
  display_name: string;
  email: string;
};

const ProfileForm: React.FC<ProfileFormProps> = ({
  initialValues,
  onClose,
}) => {
  const { uploadFile, uploadProgress, file, setFile } = useUploadFile();

  const [updateCurrUser] = useUpdateCurrUserMutation();

  const handleSubmit = async (
    values: ProfileFormValues,
    actions: FormikHelpers<ProfileFormValues>
  ) => {
    actions.setSubmitting(true);

    const dirtyFields: Partial<UpdateUserInput> = Object.entries(values).reduce(
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
        fieldName: 'avatar',
        initialValues: { avatar: initialValues.avatar } as Record<
          FieldName,
          string
        >,
        setFieldValue: actions.setFieldValue,
      });
      dirtyFields['avatar'] = file.name;
    }

    await updateCurrUser({ variables: { updates: dirtyFields } });

    actions.setSubmitting(false);
    onClose();
  };

  return (
    <FormContainer>
      <h2>User Profile</h2>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ isSubmitting, values, dirty }) => (
          <Form>
            <AvatarField setFile={setFile} />
            <InputField label="Display Name" name="display_name" />
            <InputField
              label="Email"
              name="email"
              type="email"
              value={values.email}
              disabled
            />
            <FillButton type="submit" disabled={isSubmitting || !dirty}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </FillButton>
          </Form>
        )}
      </Formik>
    </FormContainer>
  );
};

export default ProfileForm;
