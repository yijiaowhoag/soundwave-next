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
} from 'type-graphql';
import admin from 'firebase-admin';
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
    const sessionsRef = db
      .collection('sessions')
      .where('creatorId', '==', ctx.authSession.id)
      .orderBy(
        'createdAt',
        'desc'
      ) as FirebaseFirestore.CollectionReference<Session>;

    try {
      const querySnapshot = await sessionsRef.get();

      return querySnapshot
        ? querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        : [];
    } catch (err) {
      throw new Error(err);
    }
  }

  @Query(() => Session)
  @UseMiddleware(isAuth)
  async session(@Arg('sessionId') sessionId: string): Promise<Session> {
    const sessionDoc = await db.collection('sessions').doc(sessionId).get();
    const sessionData = sessionDoc.data() as Partial<Session>;

    const queueRef = db
      .collection('sessions')
      .doc(sessionId)
      .collection('queue')
      .orderBy(
        'timestamp',
        'desc'
      ) as FirebaseFirestore.CollectionReference<TrackInQueue>;

    let querySnapshot: FirebaseFirestore.QuerySnapshot;
    try {
      querySnapshot = await queueRef.get();
    } catch (err) {
      throw new Error(err);
    }

    return {
      id: sessionDoc.id,
      ...sessionData,
      queue: querySnapshot ? querySnapshot.docs.map((doc) => doc.data()) : [],
    } as Session;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createSession(
    @Arg('sessionName') sessionName: string,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    try {
      await db.collection('sessions').add({
        name: sessionName,
        creatorId: ctx.authSession.id,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
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
