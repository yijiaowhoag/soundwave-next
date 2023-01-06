import { InterfaceType, Field, ObjectType, ID } from 'type-graphql';
import { Image } from './Image';

@InterfaceType()
abstract class IArtist {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  uri: string;
}

@ObjectType({ implements: IArtist })
export class Artist implements IArtist {
  id: string;
  name: string;
  uri: string;
}

@ObjectType({ implements: IArtist })
export class FavoriteArtist extends Artist {
  @Field(() => [String])
  genres: string[];

  @Field(() => [Image])
  images: Image[];
}
