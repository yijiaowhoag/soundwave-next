import { storage } from './init';
import {
  GetSignedUrlConfig,
  GetSignedUrlResponse,
} from '@google-cloud/storage';

const corsConfig = [
  {
    origin: ['http://localhost:8080', 'https://soundwave-next.vercel.app'],
    responseHeader: ['Content-Type'],
    method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    maxAgeSeconds: 3600,
  },
];
const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET);
bucket
  .setCorsConfiguration(corsConfig)
  .then(() => {})
  .catch((err) => console.error('Error updating CORS configuration:', err));

export const generateV4UploadSignedUrl = async (
  filename: string,
  mimetype: string
) => {
  const options: GetSignedUrlConfig = {
    version: 'v4',
    action: 'write',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType: mimetype,
  };

  const signedUrlResponse: GetSignedUrlResponse = await bucket
    .file(filename)
    .getSignedUrl(options);

  const [url] = signedUrlResponse;

  return url;
};

export const getPublicUrl = (filename: string): string => {
  const file = bucket.file(filename);

  return file.publicUrl();
};
