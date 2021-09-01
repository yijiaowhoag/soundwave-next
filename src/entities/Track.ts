import { Field, ObjectType, ID, Int } from 'type-graphql';
import { Artist } from './Artist';
import { Image } from './Image';

@ObjectType()
export class Track {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => [Artist])
  artists: Artist[];

  @Field(() => [Image])
  images: Image[];

  @Field(() => Int)
  duration_ms: number;

  @Field()
  uri: string;
}
