import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { usePlayMutation, TrackInQueue } from '../../__generated__/types';
import { useDevice } from '../../contexts/DeviceContext';
import { usePlayer } from '../../contexts/PlayerContext';
import { usePlaybackState } from '../../contexts/PlaybackStateContext';
import Track from './Track';

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 0;
  // overflow: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  ul {
    padding: 0;
    list-style: none;
  }
`;

interface PlaylistProps {
  sessionId: string;
  queue?: TrackInQueue[];
}

const Playlist: React.FC<PlaylistProps> = ({ sessionId, queue }) => {
  const device = useDevice();
  const player = usePlayer();
  const playbackState = usePlaybackState();

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
    <Container>
      <ul>
        {queue && queue.length > 0 ? (
          queue.map((track) => (
            <li key={`${track.id}`} onClick={() => setSelected(track.id)}>
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
      </ul>
    </Container>
  );
};

export default Playlist;
