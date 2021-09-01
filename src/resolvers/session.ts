import {
  Resolver,
  Query,
  Mutation,
  Ctx,
  UseMiddleware,
  Arg,
  InputType,
  ID,
  Int,
  Field,
  ObjectType,
} from 'type-graphql';
import { Session } from '../entities/Session';
import { TrackInQueue, ArtistInQueue } from '../entities/Queue';
import { db } from '../services/firebase';
import { isAuth } from '../middleware/isAuth';
import { Context } from '../types';

@InputType()
export class ArtistInput implements ArtistInQueue {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;
}

@InputType()
export class ImageInput {
  @Field(() => Int, { nullable: true })
  width?: number;

  @Field(() => Int, { nullable: true })
  height?: number;

  @Field()
  url: string;
}

@InputType()
export class AddTrackInput {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => [ArtistInput])
  artists: ArtistInput[];

  @Field(() => [ImageInput])
  images: ImageInput[];

  @Field(() => Int)
  duration_ms: number;

  @Field()
  uri: string;
}

@InputType()
export class RemoveTrackInput extends AddTrackInput {
  @Field()
  timestamp!: string;
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

@Resolver(Session)
export class SessionResolver {
  @Query(() => [Session])
  @UseMiddleware(isAuth)
  async sessions(@Ctx() ctx: Context): Promise<Session[]> {
    const userDoc = await db.collection('users').doc(ctx.authSession.id).get();

    return userDoc.data()?.sessions;
  }

  @Query(() => Session)
  @UseMiddleware(isAuth)
  async session(@Arg('sessionId') sessionId: string): Promise<Session> {
    const sessionDoc = await db.collection('sessions').doc(sessionId).get();
    const sessionData = sessionDoc.data() as Partial<Session>;

    const queue = await db
      .collection('sessions')
      .doc(sessionId)
      .collection('queue')
      .orderBy('timestamp', 'desc')
      .get();

    const trackIds: string[] = [];

    const list = (
      queue
        ? queue.docs.map((doc) => {
            trackIds.push(doc.data().id);

            return {
              ...doc.data(),
              id: doc.id,
              timestamp: doc.data().timestamp.toString(),
            };
          })
        : []
    ) as TrackInQueue[];

    return {
      id: sessionDoc.id,
      ...sessionData,
      queue: list,
      trackIds,
    } as Session;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createSession(
    @Arg('sessionName') sessionName: string,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    try {
      const sessionRef = await db.collection('sessions').add({
        name: sessionName,
        users: [{ id: ctx.authSession!.id, name: 'Anonymous' }],
      });
      const sessionDoc = await sessionRef.get();
      const userRef = db.collection('users').doc(ctx.authSession!.id);

      db.runTransaction(async (transaction) => {
        let userDoc;
        try {
          userDoc = await transaction.get(userRef);
          const sessions = userDoc.data()?.sessions ?? [];

          transaction.update(userRef, {
            sessions: [
              { id: sessionRef.id, ...sessionDoc.data() },
              ...sessions,
            ],
          });
        } catch (err) {
          throw new Error(err);
        }
      });

      return true;
    } catch (err) {
      throw new Error(err);
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteSession(@Arg('sessionId') sessionId: string): Promise<boolean> {
    await db.collection('sessions').doc(sessionId).delete();

    return true;
  }

  @Mutation(() => TrackResponse)
  @UseMiddleware(isAuth)
  async addToSession(
    @Arg('sessionId') sessionId: string,
    @Arg('track') track: AddTrackInput
  ): Promise<TrackResponse> {
    try {
      const timestamp = Date.now().toString();

      await db
        .collection('sessions')
        .doc(sessionId)
        .collection('queue')
        .doc(`${timestamp}:${track.id}`)
        .set({ ...JSON.parse(JSON.stringify(track)), timestamp });

      return {
        track: {
          ...track,
          id: `${timestamp}:${track.id}`,
          timestamp,
        },
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  @Mutation(() => TrackResponse)
  @UseMiddleware(isAuth)
  async removeFromSession(
    @Arg('sessionId') sessionId: string,
    @Arg('track') track: RemoveTrackInput
  ): Promise<TrackResponse> {
    try {
      await db
        .collection('sessions')
        .doc(sessionId)
        .collection('queue')
        .doc(track.id)
        .delete();

      return {
        track,
      };
    } catch (err) {
      throw new Error(err);
    }
  }
}
