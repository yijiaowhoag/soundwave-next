import '../styles/globals.css';
import { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import { ThemeProvider } from 'styled-components';
import theme from '../theme';
import { AuthProvider } from '../contexts/AuthContext';
import { WebPlaybackSDKProvider } from '../contexts/WebPlaybackSDKContext';

function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <WebPlaybackSDKProvider>
            <Component {...pageProps} />
          </WebPlaybackSDKProvider>
        </AuthProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
