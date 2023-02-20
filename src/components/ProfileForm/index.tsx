import { useState } from 'react';
import styled from 'styled-components';
import { Formik, Form, FormikHelpers } from 'formik';
import isEqual from 'lodash.isequal';
import { GrEdit } from 'react-icons/gr';
import {
  useUpdateCurrUserMutation,
  useGenerateUploadUrlMutation,
  UpdateUserInput,
} from '../../__generated__/types';
import InputField from '../shared/InputField';
import { FillButton } from '../shared/Button';

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

const AvatarInput = styled.input`
  display: none;
`;

const AvatarOverlay = styled.label`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.darkGreen};
  opacity: 0;

  .edit-icon path {
    fill: white;
  }
`;

const AvatarWrapper = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  align-self: center;
  margin-bottom: 1.5rem;

  :hover {
    ${AvatarOverlay} {
      opacity: 0.8;
      transition: opacity 0.3s ${({ theme }) => theme.animations.bezier};
    }
  }
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
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
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    initialValues.avatar
  );
  const [file, setFile] = useState<File>();

  const [updateCurrUser] = useUpdateCurrUserMutation();
  const [generateUploadUrl] = useGenerateUploadUrlMutation();

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
    if (dirtyFields.avatar) {
      try {
        const { data } = await generateUploadUrl({
          variables: { filename: file.name, mimetype: file.type },
        });
        const response = await handleUploadFile(data.generateUploadUrl);

        if (!response.ok) {
          throw new Error('Failed to upload file');
        }

        dirtyFields['avatar'] = file.name;
      } catch (err) {
        delete dirtyFields.avatar;
      }
    }
    await updateCurrUser({ variables: { updates: dirtyFields } });

    actions.setSubmitting(false);
    onClose();
  };

  const handleUploadFile = async (signedUrl: string) => {
    return await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });
  };

  return (
    <FormContainer>
      <h2>User Profile</h2>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ isSubmitting, setFieldValue, values, dirty }) => (
          <Form>
            <AvatarWrapper>
              {avatarPreview ? (
                <AvatarImage src={avatarPreview} alt="Avatar" />
              ) : (
                <AvatarImage src="/default-avatar.png" alt="Avatar" />
              )}
              <AvatarOverlay>
                <AvatarInput
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFile(file);
                      const url = URL.createObjectURL(file);
                      setAvatarPreview(url);
                      setFieldValue('avatar', url);
                    }
                  }}
                />
                <GrEdit className="edit-icon" size={36} color="#fff" />
                <span>Choose Photo</span>
              </AvatarOverlay>
            </AvatarWrapper>
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
