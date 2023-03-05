import { createContext, useContext, useEffect, useState } from 'react';
import { usePlayer } from './PlayerContext';

interface PlaybackState {
  playbackState: Spotify.PlaybackState | null;
  lastPlayedTrack: Spotify.Track | null;
}

const PlaybackStateContext = createContext<PlaybackState>({
  playbackState: null,
  lastPlayedTrack: null,
});

export const PlaybackStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [playbackState, setPlaybackState] =
    useState<Spotify.PlaybackState | null>(null);
  const [lastPlayedTrack, setLastPlayedTrack] = useState<Spotify.Track | null>(
    null
  );

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
    if (state?.track_window?.current_track) {
      setLastPlayedTrack(state.track_window.current_track);
    }
  };

  return (
    <PlaybackStateContext.Provider value={{ playbackState, lastPlayedTrack }}>
      {children}
    </PlaybackStateContext.Provider>
  );
};

export const usePlaybackState = (
  interval = false,
  duration = 1000
): PlaybackState => {
  const fromContext = useContext(PlaybackStateContext);

  const [playbackState, setPlaybackState] = useState(
    fromContext?.playbackState
  );
  const [lastPlayedTrack, setLastPlayedTrack] = useState(
    fromContext?.lastPlayedTrack
  );

  const player = usePlayer();

  useEffect(() => {
    setPlaybackState(fromContext?.playbackState);
    setLastPlayedTrack(fromContext?.lastPlayedTrack);
  }, [fromContext]);

  const playbackStateIsNull = playbackState === null;
  useEffect(() => {
    if (!player || playbackStateIsNull || !interval) return;

    if (playbackState!.paused) return;

    const intervalId = window.setInterval(async () => {
      setPlaybackState(await player.getCurrentState());
    }, duration);

    return () => window.clearInterval(intervalId);
  }, [interval, player, playbackStateIsNull, playbackState?.paused, duration]);

  return { playbackState, lastPlayedTrack };
};
