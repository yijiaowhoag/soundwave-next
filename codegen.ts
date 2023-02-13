import { CodegenConfig } from '@graphql-codegen/cli';

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
      },
    },
  },
};

export default config;
