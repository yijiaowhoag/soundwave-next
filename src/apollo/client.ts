import { useMemo } from 'react';
import {
  ApolloClient,
  ApolloLink,
  from,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import merge from 'deepmerge';
import isEqual from 'lodash.isequal';
import Router from 'next/router';

const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

type TApolloClient = ApolloClient<NormalizedCacheObject>;

let apolloClient: TApolloClient;

const createHttpLink = () => {
  const { HttpLink } = require('@apollo/client/link/http');
  return new HttpLink({
    uri: '/api/graphql',
    credentials: 'include',
  });
};

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
          Router.replace('/auth/login');
        }
      });
    }

    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  const omitTypenameLink = new ApolloLink((operation, forward) => {
    const omitTypename = (key: string, value: any) =>
      key === '__typename' ? undefined : value;

    if (operation.variables) {
      operation.variables = JSON.parse(
        JSON.stringify(operation.variables),
        omitTypename
      );
    }

    return forward(operation);
  });

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: from([errorLink, omitTypenameLink, createHttpLink()]),
    cache,
    connectToDevTools: true,
  });
}

export function initializeApollo(initialState?: NormalizedCacheObject) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client,
  // the initial state gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the initialState from getStaticProps/getServerSideProps in the existing cache
    const data = merge(existingCache, initialState, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        ),
      ],
    });

    // Restore the cache with the merged data
    _apolloClient.cache.restore(initialState);
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function addApolloState(client, pageProps) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
}

export function useApollo(pageProps) {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(() => initializeApollo(state), [state]);
  return store;
}
