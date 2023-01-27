import { createContext, useContext, useEffect, useState } from 'react';
import { usePlayer } from './PlayerContext';

const PlaybackStateContext = createContext<Spotify.PlaybackState | null>(null);

export const PlaybackStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [playbackState, setPlaybackState] =
    useState<Spotify.PlaybackState | null>(null);

  const player = usePlayer();

  useEffect(() => {
    if (!player) return;

    player.addListener('player_state_changed', playerStateChanged);

    return () =>
      player.removeListener('player_state_changed', playerStateChanged);
  }, [player]);

  const playerStateChanged = (state: Spotify.PlaybackState) => {
    console.log('playerStateChanged', state);
    setPlaybackState(state);
  };

  return (
    <PlaybackStateContext.Provider value={playbackState}>
      {children}
    </PlaybackStateContext.Provider>
  );
};

export const usePlaybackState = (
  interval = false,
  duration = 1000
): Spotify.PlaybackState | null => {
  const fromContext = useContext(PlaybackStateContext);

  const [playbackState, setPlaybackState] = useState(fromContext);

  const player = usePlayer();

  useEffect(() => setPlaybackState(fromContext), [fromContext]);

  const playbackStateIsNull = playbackState === null;
  useEffect(() => {
    if (!player || playbackStateIsNull || !interval) return;

    if (playbackState!.paused) return;

    const intervalId = window.setInterval(async () => {
      setPlaybackState(await player.getCurrentState());
    }, duration);

    return () => window.clearInterval(intervalId);
  }, [interval, player, playbackStateIsNull, playbackState?.paused, duration]);

  return playbackState;
};
