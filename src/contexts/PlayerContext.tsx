import { createContext, useContext, useRef, useState, useEffect } from 'react';
import { useSDK } from './SDKContext';

export const PlayerContext = createContext<{
  player?: Spotify.Player;
  playbackState?: Spotify.PlaybackState;
}>({});

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider: React.FC<{
  getOAuthToken: Spotify.PlayerInit['getOAuthToken'];
  name: Spotify.PlayerInit['name'];
  volume: Spotify.PlayerInit['volume'];
  connectOnInit?: boolean;
}> = ({ children, getOAuthToken, name, volume, connectOnInit = true }) => {
  const SDKReady = useSDK();

  const getOAuthTokenRef = useRef(getOAuthToken);
  getOAuthTokenRef.current = getOAuthToken;

  const [player, setPlayer] = useState<Spotify.Player>();
  const [playbackState, setPlaybackState] = useState<Spotify.PlaybackState>();

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

  useEffect(() => {
    if (!player) return;

    player.addListener('player_state_changed', playerStateChanged);

    return () =>
      player.removeListener('player_state_changed', playerStateChanged);
  }, [player]);

  const playerStateChanged = (state: Spotify.PlaybackState) => {
    setPlaybackState(state);
  };

  return (
    <PlayerContext.Provider value={{ player, playbackState }}>
      {children}
    </PlayerContext.Provider>
  );
};
