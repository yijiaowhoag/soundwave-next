import { Field, ObjectType, ID, Int } from 'type-graphql';
import { Artist } from './Artist';
import { Image } from './Image';

@ObjectType()
export class ArtistInQueue {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;
}

@ObjectType()
export class TrackInQueue {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => [Artist])
  artists: ArtistInQueue[];

  @Field(() => [Image])
  images: Image[];

  @Field(() => Int)
  duration_ms: number;

  @Field()
  uri: string;

  @Field({ nullable: true })
  timestamp: string;
}
