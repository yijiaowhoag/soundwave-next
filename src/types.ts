import { NextRequest, NextResponse } from 'next/server';
import type { JWTPayload } from 'jose';
import { SpotifyAPI } from './services/spotify-api';
import type { JWT } from './lib/jwt';
import type { Track, TrackInQueue, Artist, Image } from './__generated__/types';

export type Modify<T, R> = Omit<T, keyof R> & R;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

declare module 'jose' {
  export interface JWT extends Omit<JWTPayload, 'exp'> {
    accessToken: string;
    refreshToken: string;
    exp: number;
    user: User;
  }
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface Context {
  req: NextRequest;
  res: NextResponse;
  dataSources: { spotifyAPI: SpotifyAPI };
  session: JWT;
}

export interface SpotifyUser {
  id: string;
  country: string;
  display_name: string;
  email: string;
  explicit_content: ExplicitContent;
  external_urls: ExternalUrls;
  href: string;
  images: Image[];
  product: Subscription;
  uri: string;
}
interface ExplicitContent {
  filter_enabled: boolean;
  filter_locked: boolean;
}
interface ExternalUrls {
  spotify: string;
}

export type PreviewTrack = Omit<Track, 'artists'> & {
  artists: Array<Optional<Artist, 'genres' | 'images' | 'uri'>>;
};

export type PlaylistTrack = Omit<TrackInQueue, 'artists'> & {
  artists: Array<Optional<Artist, 'genres' | 'images' | 'uri'>>;
};

export type PlaybackTrack = Omit<PreviewTrack, 'album'>;

export enum RepeatMode {
  OFF = 'off',
  CONTEXT = 'context',
  TRACK = 'track',
}

enum Subscription {
  FREE = 'free',
  PREMIUM = 'premium',
}
