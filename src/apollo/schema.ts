import 'reflect-metadata';
import { buildTypeDefsAndResolversSync } from 'type-graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { SessionResolver } from './resolvers/session';
import { SpotifyResolver } from './resolvers/spotify';
import { UserResolver } from './resolvers/user';

const { typeDefs, resolvers } = buildTypeDefsAndResolversSync({
  resolvers: [SessionResolver, SpotifyResolver, UserResolver],
  validate: false,
});

export const schema = makeExecutableSchema({ typeDefs, resolvers });
