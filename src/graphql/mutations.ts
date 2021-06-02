import { gql, useMutation } from '@apollo/client';

const CREATE_SESSION = gql`
  mutation CreateSession($sessionName: String!) {
    createSession(sessionName: $sessionName) {
      name
      users {
        username
      }
    }
  }
`;

const ADD_TRACK = gql`
  mutation AddTrack($sessionId: String!, $track: TrackInput!) {
    addToSession(sessionId: $sessionId, track: $track) {
      code
      success
      message
      track {
        id
        name
      }
    }
  }
`;

const REMOVE_TRACK = gql`
  mutation RemoveTrack($sessionId: String!, $track: TrackInput!) {
    removeFromSession(sessionId: $sessionId, track: $track) {
      code
      success
      message
      track {
        id
        name
      }
    }
  }
`;

export const useCreateSession = (variables?: any) =>
  useMutation(CREATE_SESSION, { variables });

export const useAddTrack = (variables?: any) =>
  useMutation(ADD_TRACK, { variables });

export const useRemoveTrack = (variables?: any) =>
  useMutation(REMOVE_TRACK, { variables });
