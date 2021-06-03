import { gql, useQuery } from '@apollo/client';

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

export const useTopTracks = (variables?: any) =>
  useQuery(GET_USER_TOP_TRACKS, { variables });

export const useTopArtists = (variables?: any) =>
  useQuery(GET_USER_TOP_ARTISTS, { variables });

export const useGetSessions = (variables?: any) =>
  useQuery(GET_SESSIONS, { variables });
