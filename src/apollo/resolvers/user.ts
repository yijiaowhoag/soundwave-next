import {
  Resolver,
  FieldResolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Root,
  InputType,
  Field,
} from 'type-graphql';
import { User } from '../entities/User';
import { Search } from '../resolvers/search';
import { db } from '../../services/firebase/db';
import {
  generateV4UploadSignedUrl,
  getPublicUrl,
} from '../../services/firebase/storage';
import type { Context } from '../../types';

@InputType()
class UpdateUserInput {
  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  display_name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  explicit_content?: string;
}

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

  @Mutation(() => User)
  async updateCurrUser(
    @Arg('updates', () => UpdateUserInput) updates: UpdateUserInput,
    @Ctx() ctx: Context
  ): Promise<User> {
    if (Object(updates).hasOwnProperty('avatar')) {
      const publicUrl = await getPublicUrl(updates.avatar);
      updates['avatar'] = publicUrl;
    }
    await db.updateUser(ctx.session.user.id, updates);

    return await db.getUser(ctx.session.user.id);
  }

  @Mutation(() => String)
  async generateUploadUrl(
    @Arg('filename') filename: string,
    @Arg('mimetype') mimetype: string,
    @Ctx() ctx: Context
  ): Promise<string> {
    const url = await generateV4UploadSignedUrl(filename, mimetype);

    return url;
  }
}
