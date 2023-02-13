import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import { Image } from './Image';
import { Search } from '../resolvers/search';

enum Subscription {
  FREE = 'free',
  OPEN = 'open',
  PREMIUM = 'premium',
}

registerEnumType(Subscription, {
  name: 'Subscription',
  description: 'Spotify product subscription level',
});

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  display_name: string;

  @Field(() => String)
  email: string;

  @Field(() => [Image])
  images: Image[];

  @Field(() => Subscription, { nullable: true })
  product?: Subscription;

  @Field(() => [Search])
  searches: Search[];
}
