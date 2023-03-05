import {
  useShuffleMutation,
  useRepeatMutation,
  RepeatMode,
} from '../__generated__/types';
import { useDevice } from '../contexts/DeviceContext';
import { usePlayer } from '../contexts/PlayerContext';
import { usePlaybackState } from '../contexts/PlaybackStateContext';

const usePlayerControls = () => {
  const device = useDevice();
  const player = usePlayer();
  const { playbackState, lastPlayedTrack } = usePlaybackState();

  const [shuffle] = useShuffleMutation();
  const [repeat] = useRepeatMutation();

  const onVolumeChange = (volume: number) => {
    if (!player) return;
    if (volume === 0) {
      player.setVolume(0.000001);
    } else {
      player.setVolume(volume);
    }
  };

  const toggleShuffle = () => {
    if (!device || !playbackState) return;
    shuffle({
      variables: {
        deviceId: device.id,
        state: !playbackState.shuffle,
      },
    });
  };

  const toggleRepeat = () => {
    if (!device || !playbackState) return;
    repeat({
      variables: {
        deviceId: device.id,
        state: [RepeatMode.Off, RepeatMode.Context, RepeatMode.Track][
          (playbackState.repeat_mode + 1) % 3
        ],
      },
    });
  };

  const curr = playbackState?.track_window.current_track || lastPlayedTrack;
  const next = playbackState?.track_window.next_tracks[0];
  const isPaused = playbackState?.paused ?? true;

  console.log('LAST PLAYED TRACK:', lastPlayedTrack);

  return {
    device,
    player,
    playbackState,
    onVolumeChange,
    toggleShuffle,
    toggleRepeat,
    curr,
    next,
    isPaused,
  };
};

export default usePlayerControls;
