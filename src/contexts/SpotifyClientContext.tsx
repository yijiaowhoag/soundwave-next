import React, { createContext, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { WebPlaybackSDKProvider } from './WebPlaybackSDKContext';

export const SpotifyClientContext = createContext<any>(undefined);

export const useSDK = () => useContext(SpotifyClientContext);

export const SpotifyClientProvider: React.FC = ({ children }) => {
  const auth = useAuth();

  const token = auth?.accessToken;
  const getOAuthToken: Spotify.PlayerInit['getOAuthToken'] = useCallback(
    (cb) => {
      console.log('getOAuthToken in SDKContext changed', token);
      if (auth) cb(auth.accessToken);
    },
    [token]
  );

  return (
    <SpotifyClientContext.Provider value={getOAuthToken}>
      <WebPlaybackSDKProvider getOAuthToken={getOAuthToken}>
        {children}
      </WebPlaybackSDKProvider>
    </SpotifyClientContext.Provider>
  );
};
