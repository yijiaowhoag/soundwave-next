import { Field, ObjectType, ID, Int } from 'type-graphql';
import { Artist } from './Artist';
import { Image } from './Image';

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
