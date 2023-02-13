import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  ObjectType,
  InputType,
  Field,
  Float,
  ID,
  registerEnumType,
  createUnionType,
} from 'type-graphql';
import { Artist } from '../entities/Artist';
import { Album, Track } from '../entities/Track';
import { trackReducer } from '../../services/spotify-api';
import { db } from '../../services/firestore';
import type { Context } from '../../types';

export enum SearchType {
  Album = 'album',
  Artist = 'artist',
  Track = 'track',
}
registerEnumType(SearchType, {
  name: 'SearchType',
  description: 'Item types to search across',
});

export const SearchResult = createUnionType({
  name: 'SearchResult',
  types: () => [Artist, Album, Track],
});

@ObjectType()
export class Search {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => SearchType)
  type: SearchType;

  @Field(() => String)
  imageUrl: string;

  @Field(() => String)
  timestamp: string;
}

@InputType()
export class SeedInput {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => SearchType)
  type: SearchType;

  @Field(() => String)
  imageUrl: String;
}

@InputType()
export class AudioFiltersInput {
  @Field(() => Float, { nullable: true })
  min_acousticness?: number;

  @Field(() => Float, { nullable: true })
  max_acousticness?: number;

  @Field(() => Float, { nullable: true })
  target_acousticness?: number;

  @Field(() => Float, { nullable: true })
  min_danceability?: number;

  @Field(() => Float, { nullable: true })
  max_danceability?: number;

  @Field(() => Float, { nullable: true })
  target_danceability?: number;

  @Field(() => Float, { nullable: true })
  min_energy?: number;

  @Field(() => Float, { nullable: true })
  max_energy?: number;

  @Field(() => Float, { nullable: true })
  target_energy?: number;

  @Field(() => Float, { nullable: true })
  min_liveness?: number;

  @Field(() => Float, { nullable: true })
  max_liveness?: number;

  @Field(() => Float, { nullable: true })
  target_liveness?: number;

  @Field(() => Float, { nullable: true })
  min_tempo?: number;

  @Field(() => Float, { nullable: true })
  max_tempo?: number;

  @Field(() => Float, { nullable: true })
  target_tempo?: number;

  @Field(() => Float, { nullable: true })
  min_valence?: number;

  @Field(() => Float, { nullable: true })
  max_valence?: number;

  @Field(() => Float, { nullable: true })
  target_valence?: number;
}

@Resolver()
export class SearchResolver {
  @Query(() => [Track])
  async search(
    @Arg('query') query: string,
    @Ctx() { dataSources }: Context
  ): Promise<Array<Artist | Album | Track>> {
    const response = await dataSources.spotifyAPI.search(query);
    const items = Array.isArray(response.tracks.items)
      ? response.tracks.items.map(trackReducer)
      : [];

    return items;
  }

  @Query(() => [Track])
  async recommendations(
    @Arg('seeds', () => [String!], { nullable: true }) seeds: string[] | null,
    @Arg('filters', () => AudioFiltersInput, { nullable: true })
    filters: AudioFiltersInput | null,
    @Ctx() { dataSources }: Context
  ): Promise<Track[]> {
    console.log('recommendation seeds', seeds);
    if (!seeds) return [];

    const response = await dataSources.spotifyAPI.getRecommendations(
      seeds,
      filters &&
        Object.entries(filters).filter(([k, v], i) => filters[k] !== undefined)
    );
    const items = Array.isArray(response.tracks)
      ? response.tracks.map(trackReducer)
      : [];

    return items;
  }

  @Mutation(() => Boolean)
  async addSearch(
    @Arg('seed', () => SeedInput) seed: SeedInput,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    await db.addRecentSearch(ctx.session.user.id, seed);

    return true;
  }

  @Mutation(() => Boolean)
  async removeSearch(
    @Arg('searchId', () => String) searchId: string,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    await db.removeRecentSearch(ctx.session.user.id, searchId);

    return true;
  }
}
