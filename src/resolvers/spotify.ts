import {
  Arg,
  Ctx,
  Field,
  Float,
  InputType,
  Int,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { Track } from '../entities/Track';
import { FavoriteArtist } from '../entities/Artist';
import { isAuth } from '../middleware/isAuth';
import { Context } from '../types';

interface TrackArtistObject {
  external_urls: object;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

interface ArtistObject extends TrackArtistObject {
  genres: string[];
  images: ImageObject[];
}

interface ImageObject {
  height: number;
  url: string;
  width: number;
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
  target_valence: number;
}

const artistReducer = (artist: ArtistObject) => {
  return {
    id: artist.id,
    name: artist.name,
    genres: artist.genres,
    images: artist.images,
    uri: artist.uri,
  };
};

const trackArtistReducer = (trackArtist: TrackArtistObject) => {
  return {
    id: trackArtist.id,
    name: trackArtist.name,
    uri: trackArtist.uri,
  };
};

const trackReducer = (track: any) => {
  return {
    id: track.id,
    name: track.name,
    artists:
      track.artists && track.artists.length > 0
        ? track.artists.reduce(
            (acc: TrackArtistObject[], trackArtist: TrackArtistObject) => [
              ...acc,
              trackArtistReducer(trackArtist),
            ],
            []
          )
        : [],
    images: track.album.images.map((image: any) => ({
      width: image.width,
      height: image.height,
      url: image.url,
    })),
    duration_ms: track.duration_ms,
    uri: track.uri,
  };
};

@Resolver()
export class SpotifyResolver {
  @Query(() => [Track])
  @UseMiddleware(isAuth)
  async userTopTracks(
    @Arg('offset', () => Int, { nullable: true }) offset: number,
    @Arg('limit', () => Int, { nullable: true }) limit: number,
    @Ctx() { req, dataSources }: Context
  ): Promise<Track[]> {
    const response = await dataSources.spotifyAPI.getUserTopTracks(
      offset,
      limit
    );
    const items = Array.isArray(response.items)
      ? response.items.map(trackReducer)
      : [];

    return items;
  }

  @Query(() => [FavoriteArtist])
  @UseMiddleware(isAuth)
  async userTopArtists(
    @Arg('offset', () => Int, { nullable: true }) offset: number,
    @Arg('limit', () => Int, { nullable: true }) limit: number,
    @Ctx() { dataSources }: Context
  ): Promise<FavoriteArtist[]> {
    const response = await dataSources.spotifyAPI.getUserTopArtists(
      offset,
      limit
    );

    const items = Array.isArray(response.items)
      ? response.items.map(artistReducer)
      : [];

    return items;
  }

  @Query(() => [Track])
  @UseMiddleware(isAuth)
  async recommendations(
    @Arg('seeds', () => [String!], { nullable: true }) seeds: string[] | null,
    @Arg('filters', () => AudioFiltersInput, { nullable: true })
    filters: AudioFiltersInput | null,
    @Ctx() { dataSources }: Context
  ): Promise<Track[]> {
    if (!seeds) return [];

    const response = await dataSources.spotifyAPI.getRecommendations(
      seeds,
      filters && Object.entries(filters).filter(([k, v]) => v !== undefined)
    );
    const items = Array.isArray(response.tracks)
      ? response.tracks.map(trackReducer)
      : [];

    return items;
  }

  @Query(() => [Track])
  @UseMiddleware(isAuth)
  async search(
    @Arg('query') query: string,
    @Ctx() { dataSources }: Context
  ): Promise<Track[]> {
    const response = await dataSources.spotifyAPI.search(query);
    const items = Array.isArray(response.tracks.items)
      ? response.tracks.items.map(trackReducer)
      : [];

    return items;
  }
}
