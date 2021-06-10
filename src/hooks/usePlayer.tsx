import { useState, useEffect, useRef, useCallback } from 'react';

const noop = () => {};

const usePlayback = (token: string, onPlayerStateChanged = noop) => {
  const [isReady, setReady] = useState(false);
  const [deviceId, setDeviceId] = useState<string>();
  const [playerError, setPlayerError] = useState<Spotify.Error>();
  const [playerState, setPlayerState] = useState<Spotify.PlaybackState>();
  const playerRef = useRef<Spotify.Player>();

  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      playerRef.current = new window.Spotify.Player({
        name: 'Spotify Web Playback SDK Player',
        getOAuthToken: (cb) => cb(token),
      });

      setReady(true);
    };
  }, [token]);

  const handleReady: Spotify.PlaybackInstanceListener = useCallback(
    ({ device_id }) => {
      console.log('Ready with Device ID', device_id);

      setDeviceId(device_id);
    },
    []
  );

  const handleNotReady: Spotify.PlaybackInstanceListener = useCallback(
    ({ device_id }) => {
      console.log('Device ID is not ready for playback', device_id);
    },
    []
  );

  const handlePlayerError: Spotify.ErrorListener = useCallback((err) => {
    setPlayerError(err);
  }, []);

  const handlePlayerStateChange: Spotify.PlaybackStateListener = useCallback(
    (state) => {
      setPlayerState(state);
    },
    []
  );

  useEffect(() => {
    const player = playerRef.current;

    if (!player) return;

    // Error handling
    player.addListener('initialization_error', handlePlayerError);
    player.addListener('authentication_error', handlePlayerError);
    player.addListener('account_error', handlePlayerError);
    player.addListener('playback_error', handlePlayerError);

    // Playback status updates
    player.addListener('player_state_changed', handlePlayerStateChange);

    // Ready
    player.addListener('ready', handleReady);

    // Not Ready
    player.addListener('not_ready', handleNotReady);

    return () => {
      player.removeListener('initialization_error');
      player.removeListener('authentication_error');
      player.removeListener('account_error');
      player.removeListener('playback_error');
      player.removeListener('ready');
      player.removeListener('not_ready');
      player.removeListener('player_state_changed');
    };
  }, [isReady]);

  return { player: playerRef.current, deviceId, playerError, playerState };
};

export default usePlayback;
