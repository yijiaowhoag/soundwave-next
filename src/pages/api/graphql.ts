import { ApolloServer, AuthenticationError } from 'apollo-server-micro';
import { schema } from '../../apollo/schema';
import { SpotifyAPI } from '../../services/spotify-api';
import { getAuthSession } from '../../lib/session';

const apolloServer = new ApolloServer({
  schema,
  dataSources: () => {
    return { spotifyAPI: new SpotifyAPI() };
  },
  context: async ({ req }) => {
    const authSession = await getAuthSession(req);

    if (!authSession) {
      throw new AuthenticationError('You must be logged in');
    }

    return { authSession };
  },
  playground: true,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: '/api/graphql' });
