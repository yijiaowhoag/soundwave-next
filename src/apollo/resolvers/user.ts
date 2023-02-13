import { Resolver, FieldResolver, Query, Ctx, Root } from 'type-graphql';
import { User } from '../entities/User';
import { Search } from '../resolvers/search';
import { db } from '../../services/firestore';
import type { Context } from '../../types';

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => [Search])
  searches(@Root() currUser: User): Search[] {
    return currUser.searches;
  }

  @Query(() => User, { nullable: true })
  async currUser(@Ctx() ctx: Context): Promise<User> {
    return await db.getUser(ctx.session.user.id);
  }
}
