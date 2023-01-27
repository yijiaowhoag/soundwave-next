import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  InputType,
  ObjectType,
  Field,
  ID,
  Int,
} from 'type-graphql';
import admin from 'firebase-admin';
import { Session } from '../entities/Session';
import { TrackInQueue } from '../entities/Queue';
import { db, converter } from '../../services/firestore';
import type { Context } from '../../types';

@InputType()
export class ArtistInput {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;
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
export class TrackInput {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

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
export class AddTrackInput extends TrackInput {
  @Field({ nullable: true })
  preview_url?: string;

  @Field({ nullable: true })
  timestamp?: string;
}

@InputType()
export class RemoveTrackInput extends TrackInput {
  @Field()
  timestamp: string;
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
  async sessions(@Ctx() ctx: Context): Promise<Session[]> {
    const sessionsRef = db
      .collection('sessions')
      .withConverter(converter<Session>())
      .where('creatorId', '==', ctx.session.user.id)
      .orderBy(
        'createdAt',
        'desc'
      ) as FirebaseFirestore.CollectionReference<Session>;

    try {
      const querySnapshot = await sessionsRef.get();

      return querySnapshot ? querySnapshot.docs.map((doc) => doc.data()) : [];
    } catch (err) {
      throw new Error(err);
    }
  }

  @Query(() => Session)
  async session(@Arg('sessionId') sessionId: string): Promise<Session> {
    const sessionRef = db
      .collection('sessions')
      .withConverter(converter<Session>())
      .doc(sessionId);
    const queueRef = sessionRef
      .collection('queue')
      .withConverter(converter<TrackInQueue>())
      .orderBy('timestamp', 'desc');

    try {
      const session = await sessionRef.get();
      const queue = await queueRef.get();

      return {
        id: session.id,
        name: session.data()?.name || '',
        description: session.data()?.description || '',
        queue: queue.docs.map((doc) => doc.data()) || [],
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  @Mutation(() => Boolean)
  async createSession(
    @Arg('name') name: string,
    @Arg('description', { nullable: true }) description: string,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    try {
      await db.collection('sessions').add({
        name,
        description,
        creatorId: ctx.session.user.id,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return true;
    } catch (err) {
      throw new Error(err);
    }
  }

  @Mutation(() => Boolean)
  async deleteSession(@Arg('sessionId') sessionId: string): Promise<boolean> {
    await db.collection('sessions').doc(sessionId).delete();

    return true;
  }

  @Mutation(() => TrackResponse)
  async addToSession(
    @Arg('sessionId') sessionId: string,
    @Arg('track') track: AddTrackInput
  ): Promise<TrackResponse> {
    try {
      const timestamp = Date.now().toString();
      const trackRef = db
        .collection('sessions')
        .doc(sessionId)
        .collection('queue')
        .doc(`${timestamp}:${track.id}`)
        .withConverter(converter<TrackInQueue>());
      await trackRef.set({ ...JSON.parse(JSON.stringify(track)), timestamp });
      const data = (await trackRef.get()).data();

      return {
        track: data,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  @Mutation(() => Boolean)
  async removeFromSession(
    @Arg('sessionId') sessionId: string,
    @Arg('track') track: RemoveTrackInput
  ): Promise<boolean> {
    try {
      await db
        .collection('sessions')
        .doc(sessionId)
        .collection('queue')
        .withConverter(converter<TrackInQueue>())
        .doc(track.id)
        .delete();

      return true;
    } catch (err) {
      throw new Error(err);
    }
  }

  @Mutation(() => ID)
  async favoriteTrack(
    @Arg('track') track: AddTrackInput,
    @Ctx() ctx: Context
  ): Promise<string> {
    const id = `${Date.now().toString()}:${track.id}`;
    try {
      const result = await db
        .collection('users')
        .doc(ctx.session.user.id)
        .collection('favorites')
        .doc(id)
        .set({
          ...track,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });

      console.log('FavoriteTrack -> ', result);

      return id;
    } catch (err) {
      throw new Error(err);
    }
  }

  @Mutation(() => ID)
  async unfavoriteTrack(
    @Arg('track') track: RemoveTrackInput,
    @Ctx() ctx: Context
  ): Promise<string> {
    try {
      const result = await db
        .collection('users')
        .doc(ctx.session.user.id)
        .collection('favorites')
        .doc(`${Date.now().toString()}:${track.id}`)
        .delete();

      console.log('WriteResult: ', result);
      return track.id;
    } catch (err) {
      throw new Error(err);
    }
  }
}
