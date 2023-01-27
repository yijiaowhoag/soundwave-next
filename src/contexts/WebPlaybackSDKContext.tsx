import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from 'react';
import { useAuth } from './AuthContext';
import { PlayerProvider } from './PlayerContext';
import { DeviceProvider } from './DeviceContext';
import { PlaybackStateProvider } from './PlaybackStateContext';

export const WebPlaybackSDKContext = createContext<boolean | undefined>(
  undefined
);

export const useWebPlaybackSDK = () => useContext(WebPlaybackSDKContext);

export const WebPlaybackSDKProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const auth = useAuth();
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

  const token = auth?.accessToken;
  const getOAuthToken: Spotify.PlayerInit['getOAuthToken'] = useCallback(
    (cb) => {
      if (auth) cb(auth.accessToken);
    },
    [token]
  );

  return (
    <WebPlaybackSDKContext.Provider value={ready}>
      <PlayerProvider
        getOAuthToken={getOAuthToken}
        name="Spotify Web Playback SDK"
        volume={0.5}
        connectOnInit
      >
        <PlaybackStateProvider>
          <DeviceProvider>{children}</DeviceProvider>
        </PlaybackStateProvider>
      </PlayerProvider>
    </WebPlaybackSDKContext.Provider>
  );
};
