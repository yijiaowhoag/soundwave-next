import * as dotenv from 'dotenv';
import { CodegenConfig } from '@graphql-codegen/cli';

dotenv.config();

const config: CodegenConfig = {
  overwrite: true,
  schema: './src/apollo/schema.ts',
  documents: ['./src/graphql/**/*.graphql'],
  generates: {
    './src/__generated__/types.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        enumAsTypes: true,
        enumValues: {
          SearchType: {
            album: 'Album',
            artist: 'Artist',
            track: 'Track',
          },
        },
        FIREBASE_SERVICE_ACCOUNT_KEY: process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
        FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      },
    },
  },
};

export default config;
