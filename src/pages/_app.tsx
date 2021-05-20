import '../styles/globals.css';

import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';

export default function App({ Component, pageProps }: any) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
