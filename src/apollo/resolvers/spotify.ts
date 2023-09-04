import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  ObjectType,
  Field,
  Int,
  registerEnumType,
} from 'type-graphql';
import { Artist, ArtistDetails } from '../entities/Artist';
import { Track } from '../entities/Track';
import { RepeatMode, type Context } from '../../types';

registerEnumType(RepeatMode, { name: 'RepeatMode' });

@ObjectType()
export class UserTopItems {
  @Field(() => [Track])
  topTracks: Track[];

  @Field(() => [Artist])
  topArtists: Artist[];
}

@Resolver()
export class SpotifyResolver {
  @Query(() => UserTopItems)
  async userTopItems(
    @Arg('offset', () => Int, { nullable: true }) offset: number,
    @Arg('limit', () => Int, { nullable: true }) limit: number,
    @Ctx() { dataSources }: Context
  ): Promise<UserTopItems> {
    const { items: topTracks } = await dataSources.spotifyAPI.getUserTopTracks(
      offset,
      limit
    );
    const { items: topArtists } =
      await dataSources.spotifyAPI.getUserTopArtists(offset, limit);

    return {
      topTracks: topTracks.map(trackReducer),
      topArtists: topArtists.map(artistReducer),
    };
  }

  @Query(() => [Track])
  async userRecentlyPlayed(
    @Arg('before', () => Int, { nullable: true }) before: number,
    @Arg('after', () => Int, { nullable: true }) after: number,
    @Arg('limit', () => Int, { nullable: true }) limit: number,
    @Ctx() { dataSources }: Context
  ): Promise<Track[]> {
    const { items } = await dataSources.spotifyAPI.getUserRecentlyPlayed(
      Date.now(),
      after,
      limit
    );

    return items.map((item) => ({
      ...trackReducer(item.track),
      played_at: item.played_at,
    }));
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

  @Mutation(() => Boolean)
  async play(
    @Arg('deviceId', () => String) deviceId: string,
    @Arg('uris', () => [String!]) uris: string[],
    @Arg('offset', () => Int, { nullable: true })
    offset: number,
    @Ctx() { dataSources }: Context
  ): Promise<boolean> {
    const response = await dataSources.spotifyAPI.play(deviceId, uris, offset);

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

    return true;
  }

  @Mutation(() => Boolean)
  async repeat(
    @Arg('deviceId', () => String) deviceId: string,
    @Arg('state', () => RepeatMode) state: RepeatMode,
    @Ctx() { dataSources }: Context
  ): Promise<boolean> {
    const response = await dataSources.spotifyAPI.toggleRepeat(deviceId, state);

    return true;
  }
}

export function artistReducer(artist): Artist {
  return {
    id: artist.id,
    name: artist.name,
    genres: artist.genres,
    images: artist.images,
    uri: artist.uri,
  };
}

export function trackReducer(track): Track {
  return {
    id: track.id,
    name: track.name,
    album: {
      id: track.album.id,
      name: track.album.name,
      release_date: track.album.release_date,
      images: track.album.images.map((image) => ({
        width: image.width,
        height: image.height,
        url: image.url,
      })),
    },
    artists:
      track.artists && track.artists.length > 0
        ? track.artists.reduce(
            (acc: Artist[], trackArtist) => [
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
