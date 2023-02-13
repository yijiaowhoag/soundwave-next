import 'reflect-metadata';
import { buildTypeDefsAndResolversSync } from 'type-graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { SearchResolver } from './resolvers/search';
import { SessionResolver } from './resolvers/session';
import { SpotifyResolver } from './resolvers/spotify';
import { UserResolver } from './resolvers/user';

const { typeDefs, resolvers } = buildTypeDefsAndResolversSync({
  resolvers: [SearchResolver, SessionResolver, SpotifyResolver, UserResolver],
  validate: false,
});

export const schema = makeExecutableSchema({ typeDefs, resolvers });
