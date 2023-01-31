import { Field, ID, InterfaceType, ObjectType, InputType } from 'type-graphql';
import { Track } from './Track';
import { Image } from './Image';

@InterfaceType()
abstract class IArtist {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => [String])
  genres: string[];

  @Field(() => [Image])
  images: Image[];

  @Field()
  uri: string;
}

@ObjectType({ implements: IArtist })
export class Artist implements IArtist {
  id: string;
  name: string;
  genres: string[];
  images: Image[];
  uri: string;
}

@ObjectType({ implements: IArtist })
export class ArtistDetails extends Artist {
  @Field(() => [Track])
  topTracks: Track[];

  @Field(() => [Artist])
  relatedArtists: Artist[];
}

@InputType()
export class ArtistInput {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;
}
