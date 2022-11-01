import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from 'react';
import { useAuth } from './AuthContext';
import { PlayerProvider } from './PlayerContext';
import { DeviceProvider } from './DeviceContext';

export const SDKContext = createContext<boolean | undefined>(undefined);

export const useSDK = () => useContext(SDKContext);

export const SDKProvider: React.FC = ({ children }) => {
  const user = useAuth();
  console.log('useAuth', user);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => setReady(true);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const getOAuthToken: Spotify.PlayerInit['getOAuthToken'] = useCallback(
    (cb) => {
      console.log('getOAuthToken', user);
      console.log('cb', cb);
      if (user) cb(user.accessToken);
    },
    [user]
  );

  return (
    <SDKContext.Provider value={ready}>
      <PlayerProvider
        getOAuthToken={getOAuthToken}
        name="Spotify Web Playback SDK"
        volume={0.5}
      >
        <DeviceProvider>{children}</DeviceProvider>
      </PlayerProvider>
    </SDKContext.Provider>
  );
};
