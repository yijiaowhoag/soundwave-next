import { MiddlewareFn } from 'type-graphql';
import { AuthenticationError } from 'apollo-server-micro';
import { Context } from '../../types';
import { decrypt } from '../../lib/jwt';

export const isAuth: MiddlewareFn<Context> = async (
  { context },
  next
): Promise<any> => {
  const { sessionToken } = context.req.cookies;
  const session = await decrypt({
    token: sessionToken,
    secret: process.env.TOKEN_SECRET!,
  });

  if (!session) {
    throw new AuthenticationError('You must be logged in');
  }

  context.session = session;

  return next();
};
