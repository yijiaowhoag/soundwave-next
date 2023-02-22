import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Field,
  ObjectType,
  InputType,
} from 'type-graphql';
import { Session } from '../entities/Session';
import {
  TrackInQueue,
  AddTrackInput,
  RemoveTrackInput,
} from '../entities/Track';
import { db } from '../../services/firebase/db';
import { getPublicUrl } from '../../services/firebase/storage';
import type { Context } from '../../types';

@InputType()
class UpdateSessionInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  cover?: string;
}

@Resolver(Session)
export class SessionResolver {
  @Query(() => [Session])
  async sessions(@Ctx() ctx: Context): Promise<Omit<Session, 'queue'>[]> {
    return await db.getUserSessions(ctx.session.user.id);
  }

  @Query(() => Session)
  async session(@Arg('sessionId') sessionId: string): Promise<Session> {
    return await db.getSessionById(sessionId);
  }

  @Mutation(() => Boolean)
  async createSession(
    @Arg('name') name: string,
    @Arg('description', { nullable: true }) description: string,
    @Arg('cover', { nullable: true }) cover: string,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    await db.createSession({
      name,
      description,
      cover,
      creatorId: ctx.session.user.id,
    });

    return true;
  }

  @Mutation(() => Boolean)
  async updateSession(
    @Arg('sessionId') sessionId: string,
    @Arg('updates', () => UpdateSessionInput) updates: UpdateSessionInput
  ): Promise<boolean> {
    if (Object(updates).hasOwnProperty('cover')) {
      const publicUrl = await getPublicUrl(updates.cover);
      updates['cover'] = publicUrl;
    }

    return true;
  }

  @Mutation(() => Boolean)
  async deleteSession(@Arg('sessionId') sessionId: string): Promise<boolean> {
    await db.deleteSession(sessionId);

    return true;
  }

  @Mutation(() => TrackResponse)
  async addToSession(
    @Arg('sessionId') sessionId: string,
    @Arg('track') track: AddTrackInput
  ): Promise<TrackResponse> {
    const data = await db.addTrackToSession(sessionId, track);

    return {
      track: data,
    };
  }

  @Mutation(() => Boolean)
  async removeFromSession(
    @Arg('sessionId') sessionId: string,
    @Arg('track') track: RemoveTrackInput
  ): Promise<boolean> {
    await db.removeTrackFromSession(sessionId, track.id);

    return true;
  }
}

@ObjectType()
export class SessionResponse {
  @Field()
  session: Session;
}

@ObjectType()
export class TrackResponse {
  @Field()
  track: TrackInQueue;
}
