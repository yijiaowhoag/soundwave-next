import styled from 'styled-components';
import { useFormikContext, useField } from 'formik';
import { GrEdit } from 'react-icons/gr';

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

  .edit-icon {
    margin-bottom: 5px;

    path {
      fill: transparent;
      stroke: white;
    }
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

interface AvatarFieldProps {
  setFile: (file: File) => void;
  imageStyles?: React.CSSProperties;
}

const AvatarField: React.FC<AvatarFieldProps> = ({ setFile, imageStyles }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField('avatar');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setFieldValue('avatar', URL.createObjectURL(file));
    }
  };

  const imagePreview = field.value;
  return (
    <AvatarWrapper>
      <AvatarOverlay>
        <AvatarInput type="file" accept="image/*" onChange={handleFileChange} />
        <GrEdit className="edit-icon" size={32} />
        <span>Choose Photo</span>
      </AvatarOverlay>
      {imagePreview ? (
        <AvatarImage src={imagePreview} alt="Avatar" />
      ) : (
        <AvatarImage src="/default-avatar.png" alt="Avatar" />
      )}
    </AvatarWrapper>
  );
};

export default AvatarField;
