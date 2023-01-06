import { NextRequest, NextResponse } from 'next/server';
import { AuthSession } from './lib/authSession';
import { SpotifyAPI } from './services/spotify-api';

export interface Context {
  req: NextRequest;
  res: NextResponse;
  dataSources: { spotifyAPI: SpotifyAPI };
  session: AuthSession;
}

export interface User {
  id: string;
  email: string;
  display_name: string;
  images: { width: number; height: number; url: string }[];
  spotify_product: Subscription;
}

export enum RepeatMode {
  OFF = 'off',
  CONTEXT = 'context',
  TRACK = 'track',
}

enum Subscription {
  FREE = 'free',
  PREMIUM = 'premium',
}
