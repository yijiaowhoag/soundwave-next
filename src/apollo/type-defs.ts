import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
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

  type Query {
    userTopTracks(offset: Int, limit: Int): [Track]
    userTopArtists(offset: Int, limit: Int): [Artist]
  }
`;
