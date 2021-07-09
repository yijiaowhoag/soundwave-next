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
    console.log('OFFSET', offset, 'LIMIT', limit);
    return this.get(
      `${this.baseURL}/me/top/artists?limit=${limit}&offset=${offset}`
    );
  }

  async getAudioFeatures(trackIds: string[]): Promise<any> {
    /**
     * Audio feature objects are returned in the order requested.
     * If an object is not found, a null value is returned in the appropriate position.
     * Duplicate ids in the query will result in duplicate objects in the response.
     */

    return this.get(
      `${this.baseURL}/audio-features?ids=${encodeURIComponent(
        trackIds.join(',')
      )}`
    );
  }

  async searchTracks(query: string): Promise<any> {
    // const searchParams = new URLSearchParams();
    // searchParams.append('q', query);
    // searchParams.append('type', 'track');

    const qs = querystring.stringify({ q: query, type: 'track' });

    return this.get(`${this.baseURL}/search?${qs}`);
  }
}
