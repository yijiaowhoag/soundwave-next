import { useMemo } from 'react';
import {
  ApolloClient,
  from,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import Router from 'next/router';

type TApolloClient = ApolloClient<NormalizedCacheObject>;

let apolloClient: TApolloClient;

function createIsomorphLink() {
  if (typeof window === 'undefined') {
    const { SchemaLink } = require('@apollo/client/link/schema');
    const { schema } = require('./schema');
    return new SchemaLink({ schema });
  } else {
    const { HttpLink } = require('@apollo/client/link/http');
    return new HttpLink({
      uri: '/api/graphql',
      credentials: 'same-origin',
    });
  }
}

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        userTopTracks: {
          // Don't cache separate results based on
          // any of this field's arguments.
          keyArgs: false,
          // Concatenate the incoming list items with
          // the existing list items.
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
      },
    },
  },
});

function createApolloClient() {
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path, ...error }) => {
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );

        if (error.extensions?.code === 'UNAUTHENTICATED') {
          Router.replace('/login');
        }
      });
    }

    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: from([errorLink, createIsomorphLink()]),
    cache,
  });
}

export function initializeApollo(initialState?: NormalizedCacheObject) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState?: NormalizedCacheObject) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
