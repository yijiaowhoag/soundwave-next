import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-micro';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { buildSchema } from 'type-graphql';

import { SessionResolver } from '../../resolvers/session';
import { SpotifyResolver } from '../../resolvers/spotify';
import { SpotifyAPI } from '../../services/spotify-api';

let apolloHandler: ReturnType<typeof ApolloServer.prototype.createHandler>;
const createApolloHandler = async () => {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      //  resolvers: [path.join(__dirname, '../resolvers/*.{ts,js}')],
      resolvers: [SessionResolver, SpotifyResolver],
      validate: false,
    }),
    context: ({ req }: { req: Request }) => ({
      req,
    }),
    dataSources: () => {
      return { spotifyAPI: new SpotifyAPI() };
    },
  });

  await apolloServer.start();
  apolloHandler = apolloServer.createHandler({ path: '/api/graphql' });

  return apolloHandler;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const apolloHandler = await createApolloHandler();

  return apolloHandler(req, res);
};
