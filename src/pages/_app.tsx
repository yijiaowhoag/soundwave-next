import '../styles/globals.css';
import { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import { ThemeProvider } from 'styled-components';
import theme from '../theme';
import { AuthProvider } from '../contexts/AuthContext';
import { SpotifyClientProvider } from '../contexts/SpotifyClientContext';

function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <SpotifyClientProvider>
            <Component {...pageProps} />
          </SpotifyClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
