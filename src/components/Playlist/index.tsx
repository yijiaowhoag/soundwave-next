import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import {
  usePlayMutation,
  useAddTrackMutation,
  useRemoveTrackMutation,
  SessionDocument,
  SessionQuery,
  SessionQueryVariables,
  AddTrackInput,
  RemoveTrackInput,
  TrackInQueue,
} from '../../generated/graphql';
import { useDevice } from '../../contexts/DeviceContext';
import { usePlayer } from '../../contexts/PlayerContext';
import Track from './Track';

interface PlaylistProps {
  sessionId: string;
  queue?: TrackInQueue[];
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 0;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  ul {
    padding: 0;
    list-style: none;
  }
`;

const Playlist: React.FC<PlaylistProps> = ({ sessionId, queue }) => {
  const device = useDevice();
  const { player, playbackState } = usePlayer();

  const [selected, setSelected] = useState<string>();

  const [play] = usePlayMutation();
  const [removeTrack] = useRemoveTrackMutation();

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

  // const add = (track: AddTrackInput) => {
  //   addTrack({
  //     variables: { sessionId, track },
  //     update: (cache, { data }) => {
  //       if (!data) return;

  //       const x = cache.readQuery<SessionQuery, SessionQueryVariables>({
  //         query: SessionDocument,
  //         variables: {
  //           sessionId,
  //         },
  //       });

  //       if (!x) return;

  //       cache.writeQuery<SessionQuery, SessionQueryVariables>({
  //         query: SessionDocument,
  //         variables: { sessionId },
  //         data: {
  //           session: {
  //             ...x.session,
  //             queue: x.session.queue
  //               ? [...x.session.queue, data.addToSession.track]
  //               : [],
  //           },
  //         },
  //       });
  //     },
  //   });
  // };

  // const remove = (track: RemoveTrackInput) => {
  //   removeTrack({
  //     variables: { sessionId, track },
  //     update: (cache, { data }) => {
  //       if (!data) return;

  //       const x = cache.readQuery<SessionQuery, SessionQueryVariables>({
  //         query: SessionDocument,
  //         variables: {
  //           sessionId,
  //         },
  //       });

  //       if (!x) return;

  //       cache.writeQuery<SessionQuery, SessionQueryVariables>({
  //         query: SessionDocument,
  //         variables: { sessionId },
  //         data: {
  //           session: {
  //             ...x.session,
  //             queue: x.session.queue.filter(
  //               ({ id }) => id !== data.removeFromSession?.track.id
  //             ),
  //           },
  //         },
  //       });
  //     },
  //   });
  // };
  return (
    <Container>
      <ul>
        {queue && queue.length > 0 ? (
          queue.map((track) => (
            <li key={`${track.id}`} onClick={() => setSelected(track.id)}>
              <Track
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
