import { gql, useQuery, useLazyQuery, QueryHookOptions } from '@apollo/client';

const SEARCH = gql`
  query Search($query: String) {
    search(query: $query) {
      name
      artists {
        name
      }
      images {
        url
        width
        height
      }
      duration_ms
      uri
    }
  }
`;

const GET_USER_TOP_TRACKS = gql`
  query GetUserTopTracks($offset: Int, $limit: Int) {
    userTopTracks(offset: $offset, limit: $limit) {
      id
      name
      artists {
        id
        name
        genres
      }
      images {
        url
        width
        height
      }
      duration_ms
      uri
    }
  }
`;

const GET_USER_TOP_ARTISTS = gql`
  query GetUserTopArtists($offset: Int, $limit: Int) {
    userTopArtists(offset: $offset, limit: $limit) {
      id
      name
      genres
      images {
        url
        width
        height
      }
      uri
    }
  }
`;

const GET_SESSIONS = gql`
  query GetSessions {
    sessions {
      id
      name
    }
  }
`;

const GET_SESSION = gql`
  query GetSession($sessionId: ID!) {
    session(sessionId: $sessionId) {
      queue {
        id
        name
        artists {
          id
          name
          genres
        }
        images {
          url
          width
          height
        }
        duration_ms
        uri
        timestamp
      }
      audioFeatures {
        acousticness
        danceability
        energy
        instrumentalness
        liveness
        loudness
        tempo
        valence
      }
    }
  }
`;

export const useSearch = (options?: QueryHookOptions) =>
  useLazyQuery(SEARCH, options);

export const useTopTracks = (variables?: any) =>
  useQuery(GET_USER_TOP_TRACKS, { variables });

export const useTopArtists = (variables?: any) =>
  useQuery(GET_USER_TOP_ARTISTS, { variables });

export const useGetSessions = (variables?: any) =>
  useQuery(GET_SESSIONS, { variables });
