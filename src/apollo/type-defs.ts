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
    trackIds: [String]
    audioFeatures: [AudioFeatures]
  }

  type Track {
    id: ID!
    name: String!
    artists: [Artist]
    images: [Image]
    duration_ms: Int
    uri: String
  }

  type TrackUpdated {
    id: ID!
    name: String!
    artists: [Artist]
    images: [Image]
    duration_ms: Int
    uri: String
    timestamp: String
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

  type AudioFeatures {
    acousticness: Float
    danceability: Float
    energy: Float
    instrumentalness: Float
    liveness: Float
    loudness: Float
    mode: Int
    speechiness: Float
    tempo: Float
    valence: Float
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
    search(query: String): [Track]
    userTopTracks(offset: Int, limit: Int): [Track]
    userTopArtists(offset: Int, limit: Int): [Artist]
    sessions: [Session]
  }
`;
