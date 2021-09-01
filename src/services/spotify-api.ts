import { AuthenticationError } from 'apollo-server-micro';
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest';
import querystring from 'querystring';

interface Paging<T> {
  items: T[];
  next: string;
  total: number;
  limit: number;
  offset: number;
}

export class SpotifyAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.SPOTIFY_API_ENDPOINT;
  }

  willSendRequest(request: RequestOptions) {
    if (!this.context.authSession?.accessToken)
      throw new AuthenticationError('You must be logged in with Spotify');

    request.headers.set(
      'Authorization',
      `Bearer ${this.context.authSession.accessToken}`
    );
  }

  async getUserTopTracks(offset: number, limit: number): Promise<Paging<any>> {
    return this.get(
      `${this.baseURL}/me/top/tracks?limit=${limit}&offset=${offset}`
    );
  }

  async getUserTopArtists(offset: number, limit: number): Promise<Paging<any>> {
    return this.get(
      `${this.baseURL}/me/top/artists?limit=${limit}&offset=${offset}`
    );
  }

  async search(query: string, type?: string): Promise<any> {
    const qs = querystring.stringify({ query, type: type || 'track' });

    return this.get(`${this.baseURL}/search?${qs}`);
  }

  async getRecommendations(
    seeds: string[],
    filters?: { [key: string]: number }
  ): Promise<any> {
    const str = new URLSearchParams({
      seed_tracks: seeds.join(','),
      ...filters,
    }).toString();

    return this.get(`${this.baseURL}/recommendations?${str}`);
  }
}
