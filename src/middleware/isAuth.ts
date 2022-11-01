import { MiddlewareFn } from 'type-graphql';
import { AuthenticationError } from 'apollo-server-micro';
import { Context } from '../types';
import { getAuthSession } from '../lib/authSession';

export const isAuth: MiddlewareFn<Context> = async (
  { context },
  next
): Promise<any> => {
  const authSession = await getAuthSession(context.req);

  context.authSession = authSession;

  if (!authSession) {
    throw new AuthenticationError('You must be logged in');
  }

  return next();
};
