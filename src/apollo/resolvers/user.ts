import { Resolver, Query, Ctx } from 'type-graphql';
import { User } from '../entities/User';
import { db } from '../../services/firestore';
import type { Context } from '../../types';

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: Context): Promise<User> {
    return await db.getUser(ctx.session.user.id);
  }
}
