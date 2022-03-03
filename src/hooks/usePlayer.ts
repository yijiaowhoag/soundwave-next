import { useState, useEffect, useRef, useCallback } from 'react';

interface Options {
  getOAuthToken: () => Promise<string>;
  onPlayerStateChanged?: Spotify.PlaybackStateListener;
  onPlayerError?: (err: unknown) => void;
  volume: number;
}

const noop = () => {};

const usePlayback = ({
  getOAuthToken,
  onPlayerStateChanged = noop,
  onPlayerError = noop,
  volume,
}: Options) => {
  const [isReady, setIsReady] = useState(false);
  const [deviceId, setDeviceId] = useState<string>();
  const playerRef = useRef<Spotify.Player>();

  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      playerRef.current = new window.Spotify.Player({
        name: 'Spotify Web Playback SDK Player',
        getOAuthToken: async (cb) => {
          const token = await getOAuthToken();
          cb(token);
        },
        volume,
      });

      setIsReady(true);
    };
  }, []);

  const handleReady: Spotify.PlaybackInstanceListener = useCallback(
    ({ device_id }) => {
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

  useEffect(() => {
    if (isReady && playerRef.current) {
      playerRef.current.connect();
    }
  }, [isReady]);

  useEffect(() => {
    const player = playerRef.current;

    if (isReady && player) {
      // Error handling
      player.addListener('initialization_error', onPlayerError);
      player.addListener('authentication_error', onPlayerError);
      player.addListener('account_error', onPlayerError);
      player.addListener('playback_error', onPlayerError);

      // Playback status updates
      player.addListener('player_state_changed', onPlayerStateChanged);

      // Ready
      player.addListener('ready', handleReady);

      // Not Ready
      player.addListener('not_ready', handleNotReady);

      return () => {
        player.removeListener('initialization_error', onPlayerError);
        player.removeListener('authentication_error', onPlayerError);
        player.removeListener('account_error', onPlayerError);
        player.removeListener('playback_error', onPlayerError);
        player.removeListener('player_state_changed', onPlayerStateChanged);
        player.removeListener('ready', handleReady);
        player.removeListener('not_ready', handleNotReady);
      };
    }
  }, [isReady, onPlayerStateChanged]);

  return {
    isReady,
    deviceId,
    player: playerRef.current,
  };
};

export default usePlayback;
