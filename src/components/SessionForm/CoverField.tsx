import styled from 'styled-components';
import { useFormikContext, useField } from 'formik';
import { GrEdit } from 'react-icons/gr';

const ImageInput = styled.input`
  display: none;
`;

const ImageOverlay = styled.label`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: ${({ theme }) => theme.colors.darkest80};
  opacity: 0;

  .edit-icon {
    margin-bottom: 5px;

    path {
      fill: transparent;
      stroke: white;
    }
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
  object-fit: cover;
`;

const DefaultImage = styled.div`
  height: 100%;
  border-radius: 6px;

  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 0;
    width: 100px;
    height: 100px;
  }

  .underlay {
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    border-radius: 6px;
    background-color: ${({ theme }) => theme.colors.lightGreen30};
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  align-self: center;

  :hover {
    ${ImageOverlay} {
      opacity: 1;
      transition: opacity 0.3s ${({ theme }) => theme.animations.bezier};
    }

    ${Image}, ${DefaultImage} {
      opacity: 0.5;
      transition: opacity 0.3s ${({ theme }) => theme.animations.bezier};
    }
  }
`;
interface EditableCoverProps {
  name: string;
  setFile: (file: File) => void;
  imageStyles?: React.CSSProperties;
}

const EditableCover: React.FC<EditableCoverProps> = ({
  name,
  setFile,
  imageStyles,
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setFieldValue(name, URL.createObjectURL(file));
    }
  };

  const imagePreview = field.value;

  return (
    <ImageWrapper style={imageStyles}>
      <ImageOverlay>
        <ImageInput
          type="file"
          name={name}
          accept="image/*"
          onChange={handleFileChange}
        />
        <GrEdit className="edit-icon" size={32} />
        <span>Choose Photo</span>
      </ImageOverlay>
      {imagePreview ? (
        <Image src={imagePreview} alt="Preview" />
      ) : (
        <DefaultImage>
          <img src="/default-session-cover.png" />
          <div className="underlay" />
        </DefaultImage>
      )}
      {meta.touched && meta.error && <p>{meta.error}</p>}
    </ImageWrapper>
  );
};

export default EditableCover;
