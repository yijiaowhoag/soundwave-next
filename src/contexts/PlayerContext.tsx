import { createContext, useContext, useRef, useState, useEffect } from 'react';
import { useWebPlaybackSDK } from './WebPlaybackSDKContext';

export const PlayerContext = createContext<Spotify.Player | null>(null);

export const PlayerProvider: React.FC<{
  children: React.ReactNode;
  getOAuthToken: Spotify.PlayerInit['getOAuthToken'];
  name: Spotify.PlayerInit['name'];
  volume: Spotify.PlayerInit['volume'];
  connectOnInit?: boolean;
}> = ({ children, getOAuthToken, name, volume, connectOnInit = true }) => {
  const SDKReady = useWebPlaybackSDK();

  const [player, setPlayer] = useState<Spotify.Player | null>(null);

  const getOAuthTokenRef = useRef(getOAuthToken);
  useEffect(() => {
    getOAuthTokenRef.current = getOAuthToken;
  }, [getOAuthToken]);

  useEffect(() => {
    if (SDKReady) {
      const player = new Spotify.Player({
        getOAuthToken: (cb) => getOAuthTokenRef.current(cb),
        name,
        volume,
      });
      setPlayer(player);

      if (connectOnInit) player.connect();

      return () => player.disconnect();
    }
  }, [connectOnInit, SDKReady]);

  return (
    <PlayerContext.Provider value={player}>{children}</PlayerContext.Provider>
  );
};

export const usePlayer = (): Spotify.Player | null => {
  const value = useContext(PlayerContext);

  if (value === undefined) throw new Error('PlayerContext not available');

  return value;
};
