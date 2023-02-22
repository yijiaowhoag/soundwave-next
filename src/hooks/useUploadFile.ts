import { useState } from 'react';
import { useGenerateUploadUrlMutation } from '../__generated__/types';

export type FieldName = 'avatar' | 'cover';

type UploadFileOptions = {
  fieldName: FieldName;
  initialValues: Record<FieldName, string>;
  setFieldValue: (field: FieldName, value: string) => void;
};

const useUploadFile = () => {
  const [file, setFile] = useState<File>();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [generateUploadUrl] = useGenerateUploadUrlMutation();

  const handleUploadFile = async (url: string, file: File) => {
    return await fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });
  };

  const uploadFile = async ({
    fieldName,
    initialValues,
    setFieldValue,
  }: UploadFileOptions) => {
    try {
      const { data } = await generateUploadUrl({
        variables: { filename: file.name, mimetype: file.type },
      });
      const response = await handleUploadFile(data.generateUploadUrl, file);

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }
      setUploadProgress(0);
      const updatedValue = fieldName === 'avatar' ? response.url : file.name;
      setFieldValue(fieldName, updatedValue);
    } catch (err) {
      console.error(err);
      setFieldValue(fieldName, initialValues[fieldName]);
    }
  };

  return { uploadFile, uploadProgress, file, setFile };
};

export default useUploadFile;
