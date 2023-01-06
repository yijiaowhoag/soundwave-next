import { Resolver, Query, Ctx } from 'type-graphql';
import { User } from '../entities/User';
import { db } from '../../services/firestore';
import type { Context } from '../../types';

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: Context): Promise<User | null> {
    const user = await db
      .collection('users')
      .doc(ctx.session.user.id)
      .withConverter(userConverter)
      .get();

    return user.data() || null;
  }
}

const userConverter = {
  toFirestore: (data: User) => data,
  fromFirestore: (snapshot: FirebaseFirestore.QueryDocumentSnapshot) =>
    ({ id: snapshot.id, ...snapshot.data() } as User),
};
