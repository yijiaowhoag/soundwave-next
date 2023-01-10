import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  InputType,
  Field,
  Int,
  Float,
  registerEnumType,
} from 'type-graphql';
import { Track } from '../entities/Track';
import { Artist, ArtistDetails } from '../entities/Artist';
import { RepeatMode, type Context } from '../../types';

interface ImageObject {
  height: number;
  url: string;
  width: number;
}

registerEnumType(RepeatMode, { name: 'RepeatMode' });

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

@Resolver()
export class SpotifyResolver {
  @Query(() => [Track])
  async userTopTracks(
    @Arg('offset', () => Int, { nullable: true }) offset: number,
    @Arg('limit', () => Int, { nullable: true }) limit: number,
    @Ctx() { dataSources }: Context
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

  @Query(() => [Artist])
  async userTopArtists(
    @Arg('offset', () => Int, { nullable: true }) offset: number,
    @Arg('limit', () => Int, { nullable: true }) limit: number,
    @Ctx() { dataSources }: Context
  ): Promise<Artist[]> {
    const response = await dataSources.spotifyAPI.getUserTopArtists(
      offset,
      limit
    );

    const items = Array.isArray(response.items)
      ? response.items.map(artistReducer)
      : [];

    return items;
  }

  @Query(() => ArtistDetails)
  async artistDetails(
    @Arg('artistId', () => String) artistId: string,
    @Arg('market', () => String) market: string,
    @Ctx() { dataSources }: Context
  ): Promise<ArtistDetails> {
    const artist = await dataSources.spotifyAPI.getArtist(artistId);
    const { tracks } = await dataSources.spotifyAPI.getArtistTopTracks(
      artistId,
      market
    );
    const { artists } = await dataSources.spotifyAPI.getRelatedArtists(
      artistId
    );

    return {
      ...artistReducer(artist),
      topTracks: tracks.map(trackReducer),
      relatedArtists: artists.map(artistReducer),
    };
  }

  @Query(() => [Track])
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

  @Mutation(() => Boolean)
  async play(
    @Arg('deviceId', () => String) deviceId: string,
    @Arg('uris', () => [String!]) uris: string[],
    @Arg('offset', () => Int, { nullable: true })
    offset: number,
    @Ctx() { dataSources }: Context
  ): Promise<boolean> {
    const response = await dataSources.spotifyAPI.play(deviceId, uris, offset);

    if (response.error) {
      throw new Error(response.error.message);
    }

    return true;
  }

  @Mutation(() => Boolean)
  async shuffle(
    @Arg('deviceId', () => String) deviceId: string,
    @Arg('state', () => Boolean) state: boolean,
    @Ctx() { dataSources }: Context
  ): Promise<boolean> {
    const response = await dataSources.spotifyAPI.toggleShuffle(
      deviceId,
      state
    );

    if (response.error) {
      console.log('RESPONSE.ERROR', response.error.message);
      throw new Error(response.error.message);
    }

    return true;
  }

  @Mutation(() => Boolean)
  async repeat(
    @Arg('deviceId', () => String) deviceId: string,
    @Arg('state', () => RepeatMode) state: RepeatMode,
    @Ctx() { dataSources }: Context
  ): Promise<boolean> {
    const response = await dataSources.spotifyAPI.toggleRepeat(deviceId, state);

    if (response.error) {
      throw new Error(response.error.message);
    }

    return true;
  }
}

function artistReducer(artist) {
  return {
    id: artist.id,
    name: artist.name,
    genres: artist.genres,
    images: artist.images,
    uri: artist.uri,
  };
}

function trackReducer(track) {
  return {
    id: track.id,
    name: track.name,
    album: {
      id: track.album.id,
      name: track.album.name,
      release_date: track.album.release_date,
      images: track.album.images.map((image: ImageObject) => ({
        width: image.width,
        height: image.height,
        url: image.url,
      })),
    },
    artists:
      track.artists && track.artists.length > 0
        ? track.artists.reduce(
            (acc: Artist[], trackArtist: Artist) => [
              ...acc,
              artistReducer(trackArtist),
            ],
            []
          )
        : [],
    duration_ms: track.duration_ms,
    popularity: track.popularity,
    uri: track.uri,
    preview_url: track.preview_url,
  };
}
