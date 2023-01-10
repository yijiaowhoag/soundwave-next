import { Field, ObjectType, ID, Int } from 'type-graphql';
import { Artist } from './Artist';
import { Image } from './Image';

@ObjectType()
export class Album {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  release_date: string;

  @Field(() => [Image])
  images: Image[];
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

  @Field(() => Int)
  popularity: number;

  @Field(() => String, { nullable: true })
  preview_url?: string;
}
