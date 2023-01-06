import 'reflect-metadata';
import { ApolloServer, BaseContext, ContextFunction } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { GraphQLError } from 'graphql';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { schema } from '../../apollo/schema';
import { SpotifyAPI } from '../../services/spotify-api';
import { encrypt, decrypt, JWT } from '../../lib/jwt';
import { refreshAccessToken } from '../../services/auth';
import { setCookie } from '../../lib/cookies';

interface Context extends BaseContext {
  session?: JWT;
  dataSources: {
    spotifyAPI: SpotifyAPI;
  };
}

const createApolloContext: ContextFunction<
  Parameters<NextApiHandler>,
  Context
> = async (req, res) => {
  const { sessionToken } = req.cookies;

  const session = await decrypt({
    token: sessionToken,
    secret: process.env.TOKEN_SECRET!,
  });

  if (!session) {
    throw new GraphQLError('User is not authenticated', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    });
  }

  if (Date.now() > session.exp) {
    const { access_token, expires_in } = await refreshAccessToken(
      session.refreshToken
    );
    session['accessToken'] = access_token;
    session['exp'] = Date.now() + expires_in * 1000;

    const token = await encrypt({
      payload: session,
      secret: process.env.TOKEN_SECRET,
    });
    setCookie(res, { name: 'sessionToken', value: token });
  }

  return {
    session,
    dataSources: {
      spotifyAPI: new SpotifyAPI({ session }),
    },
  };
};

const apolloServer = new ApolloServer<Context>({
  schema,
});

export default startServerAndCreateNextHandler<Context>(apolloServer, {
  context: createApolloContext,
});
