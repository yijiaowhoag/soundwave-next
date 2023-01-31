import { Field, ID, Int, ObjectType, InputType } from 'type-graphql';
import { Artist, ArtistInput } from './Artist';
import { Image, ImageInput } from './Image';

@ObjectType()
export class Album {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => [Image])
  images: Image[];

  @Field(() => String, { nullable: true })
  release_date?: string;
}

@ObjectType()
export class Track {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Album)
  album: Album;

  @Field(() => [Artist])
  artists: Artist[];

  @Field(() => Int)
  duration_ms: number;

  @Field()
  uri: string;

  @Field(() => Int, { nullable: true })
  popularity?: number;

  @Field(() => String, { nullable: true })
  preview_url?: string;
}

@ObjectType()
export class TrackInQueue {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => [Artist])
  artists: Artist[];

  @Field(() => [Image])
  images: Image[];

  @Field(() => Int)
  duration_ms: number;

  @Field()
  uri: string;

  @Field()
  timestamp: string;
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
