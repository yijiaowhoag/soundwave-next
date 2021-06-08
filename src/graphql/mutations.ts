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
        timestamp
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
        timestamp
      }
    }
  }
`;

export const useCreateSession = (variables?: any) =>
  useMutation(CREATE_SESSION, { variables });

export const useAddTrack = (variables?: any) =>
  useMutation(ADD_TRACK, {
    variables,
    update(cache, { data: { addToSession } }) {
      console.log('update(Add)', addToSession);

      // cache.writeFragment({
      //   id:
      //   data:
      // })

      cache.modify({
        fields: {
          queue(existingSession) {
            console.log('existingSession(Add)', addToSession);
          },
        },
      });
    },
  });

export const useRemoveTrack = (variables?: any) =>
  useMutation(REMOVE_TRACK, {
    variables,
    update(cache, { data: { removeFromSession } }) {
      console.log('update(Remove)', removeFromSession);

      cache.modify({
        fields: {
          queue(existingSession) {},
        },
      });
    },
  });
