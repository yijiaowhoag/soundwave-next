import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { usePlayMutation } from '../../__generated__/types';
import { useDevice } from '../../contexts/DeviceContext';
import { usePlayer } from '../../contexts/PlayerContext';
import { usePlaybackState } from '../../contexts/PlaybackStateContext';
import Track from './Track';
import type { PlaylistTrack } from '../../types';

const Queue = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  p {
    margin-left: 3rem;
  }
`;

interface PlaylistProps {
  sessionId: string;
  queue?: PlaylistTrack[];
  updateQueueOffset: (idx: number) => void;
}

const Playlist: React.FC<PlaylistProps> = ({
  sessionId,
  queue,
  updateQueueOffset,
}) => {
  const device = useDevice();
  const player = usePlayer();
  const { playbackState } = usePlaybackState();

  const [selected, setSelected] = useState<string>();

  const [play] = usePlayMutation();

  const playTrack = useCallback(
    (position: string) => (e: React.MouseEvent) => {
      e.preventDefault();

      if (!device || !queue) return;

      const uris = queue.map((track) => track.uri);
      const offset = queue.findIndex((track) => track.id === position);
      play({ variables: { deviceId: device.id, uris, offset } });
    },
    [device, queue]
  );

  const togglePlay = useCallback(() => {
    if (!player || !playbackState) return;

    player.togglePlay();
  }, [player, playbackState]);

  return (
    <Queue>
      {queue && queue.length > 0 ? (
        queue.map((track, idx) => (
          <li
            key={`${track.id}`}
            onClick={() => {
              setSelected(track.id);
              updateQueueOffset(idx);
            }}
          >
            <Track
              sessionId={sessionId}
              track={track}
              isCurrent={
                playbackState?.track_window.current_track.id === track.id
              }
              isPaused={playbackState?.paused ?? true}
              isSelected={track.id === selected}
              playTrack={playTrack}
              togglePlay={togglePlay}
            />
          </li>
        ))
      ) : (
        <p>Nothing is here</p>
      )}
    </Queue>
  );
};

export default Playlist;
