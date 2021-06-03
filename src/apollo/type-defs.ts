import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
  }

  type Session {
    id: ID
    name: String!
    users: [User]
    queue: [Track]
  }

  type Track {
    id: ID!
    name: String!
    artists: [Artist]
    images: [Image]
    duration_ms: Int
    uri: String
  }

  type Artist {
    id: ID!
    name: String!
    genres: [String]
    images: [Image]
    uri: String
  }

  type Image {
    url: String!
    width: Int
    height: Int
  }

  input TrackInput {
    id: ID!
    name: String!
    artists: [ArtistInput]
    images: [ImageInput]
    duration_ms: Int
    uri: String
  }

  input ArtistInput {
    id: ID!
    name: String!
    genres: [String]
  }

  input ImageInput {
    url: String!
    width: Int
    height: Int
  }

  interface MutationResponse {
    code: String!
    success: Boolean!
    message: String
  }

  type UpdateSessionResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String
    track: Track
  }

  type Query {
    userTopTracks(offset: Int, limit: Int): [Track]
    userTopArtists(offset: Int, limit: Int): [Artist]
    sessions: [Session]
  }
`;
