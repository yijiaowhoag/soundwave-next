import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AddTrackInput = {
  id: Scalars['ID'];
  name: Scalars['String'];
  artists: Array<ArtistInput>;
  images: Array<ImageInput>;
  duration_ms: Scalars['Int'];
  uri: Scalars['String'];
};

export type Artist = IArtist & {
  __typename?: 'Artist';
  id: Scalars['ID'];
  name: Scalars['String'];
  uri: Scalars['String'];
};

export type ArtistInput = {
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type AudioFiltersInput = {
  min_acousticness?: Maybe<Scalars['Float']>;
  max_acousticness?: Maybe<Scalars['Float']>;
  target_acousticness?: Maybe<Scalars['Float']>;
  min_danceability?: Maybe<Scalars['Float']>;
  max_danceability?: Maybe<Scalars['Float']>;
  target_danceability?: Maybe<Scalars['Float']>;
  min_energy?: Maybe<Scalars['Float']>;
  max_energy?: Maybe<Scalars['Float']>;
  target_energy?: Maybe<Scalars['Float']>;
  min_liveness?: Maybe<Scalars['Float']>;
  max_liveness?: Maybe<Scalars['Float']>;
  target_liveness?: Maybe<Scalars['Float']>;
  min_tempo?: Maybe<Scalars['Float']>;
  max_tempo?: Maybe<Scalars['Float']>;
  target_tempo?: Maybe<Scalars['Float']>;
  min_valence?: Maybe<Scalars['Float']>;
  max_valence?: Maybe<Scalars['Float']>;
  target_valence?: Maybe<Scalars['Float']>;
};

export type FavoriteArtist = IArtist & {
  __typename?: 'FavoriteArtist';
  id: Scalars['ID'];
  name: Scalars['String'];
  uri: Scalars['String'];
  genres: Array<Scalars['String']>;
  images: Array<Image>;
};

export type IArtist = {
  id: Scalars['ID'];
  name: Scalars['String'];
  uri: Scalars['String'];
};

export type Image = {
  __typename?: 'Image';
  width?: Maybe<Scalars['Int']>;
  height?: Maybe<Scalars['Int']>;
  url: Scalars['String'];
};

export type ImageInput = {
  width?: Maybe<Scalars['Int']>;
  height?: Maybe<Scalars['Int']>;
  url: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createSession: Scalars['Boolean'];
  deleteSession: Scalars['Boolean'];
  addToSession: TrackResponse;
  removeFromSession: TrackResponse;
  play: Scalars['Boolean'];
  shuffle: Scalars['Boolean'];
  repeat: Scalars['Boolean'];
};


export type MutationCreateSessionArgs = {
  sessionName: Scalars['String'];
};


export type MutationDeleteSessionArgs = {
  sessionId: Scalars['String'];
};


export type MutationAddToSessionArgs = {
  track: AddTrackInput;
  sessionId: Scalars['String'];
};


export type MutationRemoveFromSessionArgs = {
  track: RemoveTrackInput;
  sessionId: Scalars['String'];
};


export type MutationPlayArgs = {
  offset?: Maybe<Scalars['Int']>;
  uris: Array<Scalars['String']>;
  deviceId: Scalars['String'];
};


export type MutationShuffleArgs = {
  state: Scalars['Boolean'];
  deviceId: Scalars['String'];
};


export type MutationRepeatArgs = {
  state: RepeatMode;
  deviceId: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  sessions: Array<Session>;
  session: Session;
  userTopTracks: Array<Track>;
  userTopArtists: Array<FavoriteArtist>;
  recommendations: Array<Track>;
  search: Array<Track>;
};


export type QuerySessionArgs = {
  sessionId: Scalars['String'];
};


export type QueryUserTopTracksArgs = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};


export type QueryUserTopArtistsArgs = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};


export type QueryRecommendationsArgs = {
  filters?: Maybe<AudioFiltersInput>;
  seeds?: Maybe<Array<Scalars['String']>>;
};


export type QuerySearchArgs = {
  query: Scalars['String'];
};

export type RemoveTrackInput = {
  id: Scalars['ID'];
  name: Scalars['String'];
  artists: Array<ArtistInput>;
  images: Array<ImageInput>;
  duration_ms: Scalars['Int'];
  uri: Scalars['String'];
  timestamp: Scalars['String'];
};

export enum RepeatMode {
  Track = 'TRACK',
  Context = 'CONTEXT',
  Off = 'OFF'
}

export type Session = {
  __typename?: 'Session';
  id: Scalars['ID'];
  name: Scalars['String'];
  trackIds: Array<Scalars['ID']>;
  queue?: Maybe<Array<TrackInQueue>>;
};

export type Track = {
  __typename?: 'Track';
  id: Scalars['ID'];
  name: Scalars['String'];
  artists: Array<Artist>;
  images: Array<Image>;
  duration_ms: Scalars['Int'];
  uri: Scalars['String'];
  preview_url?: Maybe<Scalars['String']>;
};

export type TrackInQueue = {
  __typename?: 'TrackInQueue';
  id: Scalars['ID'];
  name: Scalars['String'];
  artists: Array<Artist>;
  images: Array<Image>;
  duration_ms: Scalars['Int'];
  uri: Scalars['String'];
  timestamp?: Maybe<Scalars['String']>;
};

export type TrackResponse = {
  __typename?: 'TrackResponse';
  track: TrackInQueue;
};

export type AddTrackMutationVariables = Exact<{
  sessionId: Scalars['String'];
  track: AddTrackInput;
}>;


export type AddTrackMutation = { __typename?: 'Mutation', addToSession: { __typename?: 'TrackResponse', track: { __typename?: 'TrackInQueue', id: string, name: string, duration_ms: number, uri: string, timestamp?: Maybe<string>, artists: Array<{ __typename?: 'Artist', id: string, name: string }>, images: Array<{ __typename?: 'Image', url: string, width?: Maybe<number>, height?: Maybe<number> }> } } };

export type CreateSessionMutationVariables = Exact<{
  sessionName: Scalars['String'];
}>;


export type CreateSessionMutation = { __typename?: 'Mutation', createSession: boolean };

export type DeleteSessionMutationVariables = Exact<{
  sessionId: Scalars['String'];
}>;


export type DeleteSessionMutation = { __typename?: 'Mutation', deleteSession: boolean };

export type PlayMutationVariables = Exact<{
  deviceId: Scalars['String'];
  uris: Array<Scalars['String']> | Scalars['String'];
  offset?: Maybe<Scalars['Int']>;
}>;


export type PlayMutation = { __typename?: 'Mutation', play: boolean };

export type RemoveTrackMutationVariables = Exact<{
  sessionId: Scalars['String'];
  track: RemoveTrackInput;
}>;


export type RemoveTrackMutation = { __typename?: 'Mutation', removeFromSession: { __typename?: 'TrackResponse', track: { __typename?: 'TrackInQueue', id: string } } };

export type RepeatMutationVariables = Exact<{
  deviceId: Scalars['String'];
  state: RepeatMode;
}>;


export type RepeatMutation = { __typename?: 'Mutation', repeat: boolean };

export type ShuffleMutationVariables = Exact<{
  deviceId: Scalars['String'];
  state: Scalars['Boolean'];
}>;


export type ShuffleMutation = { __typename?: 'Mutation', shuffle: boolean };

export type RecommendationsQueryVariables = Exact<{
  seeds?: Maybe<Array<Scalars['String']> | Scalars['String']>;
  filters?: Maybe<AudioFiltersInput>;
}>;


export type RecommendationsQuery = { __typename?: 'Query', recommendations: Array<{ __typename?: 'Track', id: string, name: string, duration_ms: number, uri: string, preview_url?: Maybe<string>, artists: Array<{ __typename?: 'Artist', name: string }>, images: Array<{ __typename?: 'Image', url: string, width?: Maybe<number>, height?: Maybe<number> }> }> };

export type SearchQueryVariables = Exact<{
  searchTerm: Scalars['String'];
}>;


export type SearchQuery = { __typename?: 'Query', search: Array<{ __typename?: 'Track', id: string, name: string, duration_ms: number, uri: string, artists: Array<{ __typename?: 'Artist', name: string }>, images: Array<{ __typename?: 'Image', url: string, width?: Maybe<number>, height?: Maybe<number> }> }> };

export type SessionQueryVariables = Exact<{
  sessionId: Scalars['String'];
}>;


export type SessionQuery = { __typename?: 'Query', session: { __typename?: 'Session', id: string, name: string, queue?: Maybe<Array<{ __typename?: 'TrackInQueue', id: string, name: string, duration_ms: number, uri: string, timestamp?: Maybe<string>, artists: Array<{ __typename?: 'Artist', id: string, name: string }>, images: Array<{ __typename?: 'Image', url: string, width?: Maybe<number>, height?: Maybe<number> }> }>> } };

export type SessionsQueryVariables = Exact<{ [key: string]: never; }>;


export type SessionsQuery = { __typename?: 'Query', sessions: Array<{ __typename?: 'Session', id: string, name: string }> };

export type UserTopArtistsQueryVariables = Exact<{
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
}>;


export type UserTopArtistsQuery = { __typename?: 'Query', userTopArtists: Array<{ __typename?: 'FavoriteArtist', id: string, name: string, uri: string, genres: Array<string>, images: Array<{ __typename?: 'Image', url: string, width?: Maybe<number>, height?: Maybe<number> }> }> };

export type UserTopTracksQueryVariables = Exact<{
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
}>;


export type UserTopTracksQuery = { __typename?: 'Query', userTopTracks: Array<{ __typename?: 'Track', id: string, name: string, duration_ms: number, uri: string, artists: Array<{ __typename?: 'Artist', id: string, name: string }>, images: Array<{ __typename?: 'Image', url: string, width?: Maybe<number>, height?: Maybe<number> }> }> };


export const AddTrackDocument = gql`
    mutation AddTrack($sessionId: String!, $track: AddTrackInput!) {
  addToSession(sessionId: $sessionId, track: $track) {
    track {
      id
      name
      artists {
        id
        name
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
  }
}
    `;
export type AddTrackMutationFn = Apollo.MutationFunction<AddTrackMutation, AddTrackMutationVariables>;

/**
 * __useAddTrackMutation__
 *
 * To run a mutation, you first call `useAddTrackMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddTrackMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addTrackMutation, { data, loading, error }] = useAddTrackMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      track: // value for 'track'
 *   },
 * });
 */
export function useAddTrackMutation(baseOptions?: Apollo.MutationHookOptions<AddTrackMutation, AddTrackMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddTrackMutation, AddTrackMutationVariables>(AddTrackDocument, options);
      }
export type AddTrackMutationHookResult = ReturnType<typeof useAddTrackMutation>;
export type AddTrackMutationResult = Apollo.MutationResult<AddTrackMutation>;
export type AddTrackMutationOptions = Apollo.BaseMutationOptions<AddTrackMutation, AddTrackMutationVariables>;
export const CreateSessionDocument = gql`
    mutation CreateSession($sessionName: String!) {
  createSession(sessionName: $sessionName)
}
    `;
export type CreateSessionMutationFn = Apollo.MutationFunction<CreateSessionMutation, CreateSessionMutationVariables>;

/**
 * __useCreateSessionMutation__
 *
 * To run a mutation, you first call `useCreateSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSessionMutation, { data, loading, error }] = useCreateSessionMutation({
 *   variables: {
 *      sessionName: // value for 'sessionName'
 *   },
 * });
 */
export function useCreateSessionMutation(baseOptions?: Apollo.MutationHookOptions<CreateSessionMutation, CreateSessionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSessionMutation, CreateSessionMutationVariables>(CreateSessionDocument, options);
      }
export type CreateSessionMutationHookResult = ReturnType<typeof useCreateSessionMutation>;
export type CreateSessionMutationResult = Apollo.MutationResult<CreateSessionMutation>;
export type CreateSessionMutationOptions = Apollo.BaseMutationOptions<CreateSessionMutation, CreateSessionMutationVariables>;
export const DeleteSessionDocument = gql`
    mutation DeleteSession($sessionId: String!) {
  deleteSession(sessionId: $sessionId)
}
    `;
export type DeleteSessionMutationFn = Apollo.MutationFunction<DeleteSessionMutation, DeleteSessionMutationVariables>;

/**
 * __useDeleteSessionMutation__
 *
 * To run a mutation, you first call `useDeleteSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSessionMutation, { data, loading, error }] = useDeleteSessionMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *   },
 * });
 */
export function useDeleteSessionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSessionMutation, DeleteSessionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSessionMutation, DeleteSessionMutationVariables>(DeleteSessionDocument, options);
      }
export type DeleteSessionMutationHookResult = ReturnType<typeof useDeleteSessionMutation>;
export type DeleteSessionMutationResult = Apollo.MutationResult<DeleteSessionMutation>;
export type DeleteSessionMutationOptions = Apollo.BaseMutationOptions<DeleteSessionMutation, DeleteSessionMutationVariables>;
export const PlayDocument = gql`
    mutation Play($deviceId: String!, $uris: [String!]!, $offset: Int) {
  play(deviceId: $deviceId, uris: $uris, offset: $offset)
}
    `;
export type PlayMutationFn = Apollo.MutationFunction<PlayMutation, PlayMutationVariables>;

/**
 * __usePlayMutation__
 *
 * To run a mutation, you first call `usePlayMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePlayMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [playMutation, { data, loading, error }] = usePlayMutation({
 *   variables: {
 *      deviceId: // value for 'deviceId'
 *      uris: // value for 'uris'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function usePlayMutation(baseOptions?: Apollo.MutationHookOptions<PlayMutation, PlayMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PlayMutation, PlayMutationVariables>(PlayDocument, options);
      }
export type PlayMutationHookResult = ReturnType<typeof usePlayMutation>;
export type PlayMutationResult = Apollo.MutationResult<PlayMutation>;
export type PlayMutationOptions = Apollo.BaseMutationOptions<PlayMutation, PlayMutationVariables>;
export const RemoveTrackDocument = gql`
    mutation RemoveTrack($sessionId: String!, $track: RemoveTrackInput!) {
  removeFromSession(sessionId: $sessionId, track: $track) {
    track {
      id
    }
  }
}
    `;
export type RemoveTrackMutationFn = Apollo.MutationFunction<RemoveTrackMutation, RemoveTrackMutationVariables>;

/**
 * __useRemoveTrackMutation__
 *
 * To run a mutation, you first call `useRemoveTrackMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveTrackMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeTrackMutation, { data, loading, error }] = useRemoveTrackMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      track: // value for 'track'
 *   },
 * });
 */
export function useRemoveTrackMutation(baseOptions?: Apollo.MutationHookOptions<RemoveTrackMutation, RemoveTrackMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveTrackMutation, RemoveTrackMutationVariables>(RemoveTrackDocument, options);
      }
export type RemoveTrackMutationHookResult = ReturnType<typeof useRemoveTrackMutation>;
export type RemoveTrackMutationResult = Apollo.MutationResult<RemoveTrackMutation>;
export type RemoveTrackMutationOptions = Apollo.BaseMutationOptions<RemoveTrackMutation, RemoveTrackMutationVariables>;
export const RepeatDocument = gql`
    mutation Repeat($deviceId: String!, $state: RepeatMode!) {
  repeat(deviceId: $deviceId, state: $state)
}
    `;
export type RepeatMutationFn = Apollo.MutationFunction<RepeatMutation, RepeatMutationVariables>;

/**
 * __useRepeatMutation__
 *
 * To run a mutation, you first call `useRepeatMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRepeatMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [repeatMutation, { data, loading, error }] = useRepeatMutation({
 *   variables: {
 *      deviceId: // value for 'deviceId'
 *      state: // value for 'state'
 *   },
 * });
 */
export function useRepeatMutation(baseOptions?: Apollo.MutationHookOptions<RepeatMutation, RepeatMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RepeatMutation, RepeatMutationVariables>(RepeatDocument, options);
      }
export type RepeatMutationHookResult = ReturnType<typeof useRepeatMutation>;
export type RepeatMutationResult = Apollo.MutationResult<RepeatMutation>;
export type RepeatMutationOptions = Apollo.BaseMutationOptions<RepeatMutation, RepeatMutationVariables>;
export const ShuffleDocument = gql`
    mutation Shuffle($deviceId: String!, $state: Boolean!) {
  shuffle(deviceId: $deviceId, state: $state)
}
    `;
export type ShuffleMutationFn = Apollo.MutationFunction<ShuffleMutation, ShuffleMutationVariables>;

/**
 * __useShuffleMutation__
 *
 * To run a mutation, you first call `useShuffleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useShuffleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [shuffleMutation, { data, loading, error }] = useShuffleMutation({
 *   variables: {
 *      deviceId: // value for 'deviceId'
 *      state: // value for 'state'
 *   },
 * });
 */
export function useShuffleMutation(baseOptions?: Apollo.MutationHookOptions<ShuffleMutation, ShuffleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ShuffleMutation, ShuffleMutationVariables>(ShuffleDocument, options);
      }
export type ShuffleMutationHookResult = ReturnType<typeof useShuffleMutation>;
export type ShuffleMutationResult = Apollo.MutationResult<ShuffleMutation>;
export type ShuffleMutationOptions = Apollo.BaseMutationOptions<ShuffleMutation, ShuffleMutationVariables>;
export const RecommendationsDocument = gql`
    query Recommendations($seeds: [String!], $filters: AudioFiltersInput) {
  recommendations(seeds: $seeds, filters: $filters) {
    id
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
    preview_url
  }
}
    `;

/**
 * __useRecommendationsQuery__
 *
 * To run a query within a React component, call `useRecommendationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecommendationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecommendationsQuery({
 *   variables: {
 *      seeds: // value for 'seeds'
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useRecommendationsQuery(baseOptions?: Apollo.QueryHookOptions<RecommendationsQuery, RecommendationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RecommendationsQuery, RecommendationsQueryVariables>(RecommendationsDocument, options);
      }
export function useRecommendationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecommendationsQuery, RecommendationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RecommendationsQuery, RecommendationsQueryVariables>(RecommendationsDocument, options);
        }
export type RecommendationsQueryHookResult = ReturnType<typeof useRecommendationsQuery>;
export type RecommendationsLazyQueryHookResult = ReturnType<typeof useRecommendationsLazyQuery>;
export type RecommendationsQueryResult = Apollo.QueryResult<RecommendationsQuery, RecommendationsQueryVariables>;
export const SearchDocument = gql`
    query Search($searchTerm: String!) {
  search(query: $searchTerm) {
    id
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

/**
 * __useSearchQuery__
 *
 * To run a query within a React component, call `useSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchQuery({
 *   variables: {
 *      searchTerm: // value for 'searchTerm'
 *   },
 * });
 */
export function useSearchQuery(baseOptions: Apollo.QueryHookOptions<SearchQuery, SearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options);
      }
export function useSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchQuery, SearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options);
        }
export type SearchQueryHookResult = ReturnType<typeof useSearchQuery>;
export type SearchLazyQueryHookResult = ReturnType<typeof useSearchLazyQuery>;
export type SearchQueryResult = Apollo.QueryResult<SearchQuery, SearchQueryVariables>;
export const SessionDocument = gql`
    query Session($sessionId: String!) {
  session(sessionId: $sessionId) {
    id
    name
    queue {
      id
      name
      artists {
        id
        name
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
  }
}
    `;

/**
 * __useSessionQuery__
 *
 * To run a query within a React component, call `useSessionQuery` and pass it any options that fit your needs.
 * When your component renders, `useSessionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSessionQuery({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *   },
 * });
 */
export function useSessionQuery(baseOptions: Apollo.QueryHookOptions<SessionQuery, SessionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SessionQuery, SessionQueryVariables>(SessionDocument, options);
      }
export function useSessionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SessionQuery, SessionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SessionQuery, SessionQueryVariables>(SessionDocument, options);
        }
export type SessionQueryHookResult = ReturnType<typeof useSessionQuery>;
export type SessionLazyQueryHookResult = ReturnType<typeof useSessionLazyQuery>;
export type SessionQueryResult = Apollo.QueryResult<SessionQuery, SessionQueryVariables>;
export const SessionsDocument = gql`
    query Sessions {
  sessions {
    id
    name
  }
}
    `;

/**
 * __useSessionsQuery__
 *
 * To run a query within a React component, call `useSessionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSessionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSessionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useSessionsQuery(baseOptions?: Apollo.QueryHookOptions<SessionsQuery, SessionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SessionsQuery, SessionsQueryVariables>(SessionsDocument, options);
      }
export function useSessionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SessionsQuery, SessionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SessionsQuery, SessionsQueryVariables>(SessionsDocument, options);
        }
export type SessionsQueryHookResult = ReturnType<typeof useSessionsQuery>;
export type SessionsLazyQueryHookResult = ReturnType<typeof useSessionsLazyQuery>;
export type SessionsQueryResult = Apollo.QueryResult<SessionsQuery, SessionsQueryVariables>;
export const UserTopArtistsDocument = gql`
    query UserTopArtists($offset: Int, $limit: Int) {
  userTopArtists(offset: $offset, limit: $limit) {
    id
    name
    uri
    genres
    images {
      url
      width
      height
    }
  }
}
    `;

/**
 * __useUserTopArtistsQuery__
 *
 * To run a query within a React component, call `useUserTopArtistsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserTopArtistsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserTopArtistsQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useUserTopArtistsQuery(baseOptions?: Apollo.QueryHookOptions<UserTopArtistsQuery, UserTopArtistsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserTopArtistsQuery, UserTopArtistsQueryVariables>(UserTopArtistsDocument, options);
      }
export function useUserTopArtistsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserTopArtistsQuery, UserTopArtistsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserTopArtistsQuery, UserTopArtistsQueryVariables>(UserTopArtistsDocument, options);
        }
export type UserTopArtistsQueryHookResult = ReturnType<typeof useUserTopArtistsQuery>;
export type UserTopArtistsLazyQueryHookResult = ReturnType<typeof useUserTopArtistsLazyQuery>;
export type UserTopArtistsQueryResult = Apollo.QueryResult<UserTopArtistsQuery, UserTopArtistsQueryVariables>;
export const UserTopTracksDocument = gql`
    query UserTopTracks($offset: Int, $limit: Int) {
  userTopTracks(offset: $offset, limit: $limit) {
    id
    name
    artists {
      id
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

/**
 * __useUserTopTracksQuery__
 *
 * To run a query within a React component, call `useUserTopTracksQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserTopTracksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserTopTracksQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useUserTopTracksQuery(baseOptions?: Apollo.QueryHookOptions<UserTopTracksQuery, UserTopTracksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserTopTracksQuery, UserTopTracksQueryVariables>(UserTopTracksDocument, options);
      }
export function useUserTopTracksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserTopTracksQuery, UserTopTracksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserTopTracksQuery, UserTopTracksQueryVariables>(UserTopTracksDocument, options);
        }
export type UserTopTracksQueryHookResult = ReturnType<typeof useUserTopTracksQuery>;
export type UserTopTracksLazyQueryHookResult = ReturnType<typeof useUserTopTracksLazyQuery>;
export type UserTopTracksQueryResult = Apollo.QueryResult<UserTopTracksQuery, UserTopTracksQueryVariables>;