import Head from 'next/head';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  BsPlayCircleFill,
  BsPauseCircleFill,
  BsSkipStartFill,
  BsSkipEndFill,
  BsShuffle,
  BsArrowRepeat,
} from 'react-icons/bs';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import {
  usePlayMutation,
  useShuffleMutation,
  useRepeatMutation,
  TrackInQueue,
  RepeatMode,
} from '../generated/graphql';
import usePlayer from '../hooks/usePlayer';
import ProgressBar from './ProgressBar';
import Queue from './Queue';
import VolumeRangeSlider from './VolumeRangeSlider';

interface VerticalPlayerProps {
  queue?: TrackInQueue[];
}

const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  width: ${({ theme }) => theme.columns(3)};
  background-color: ${({ theme }) => theme.colors.darkGreen};
  color: white;
`;

const PlayerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 65%;
  padding: 1.5rem;
  border-bottom: 1.5px solid ${({ theme }) => theme.colors.lightGreen30};
  font-size: 12px;

  h2 {
    margin: 0;
    font-size: 18px;
  }
`;

const PlayerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const TrackImage = styled.img`
  width: 8.5em;
  height: 8.5em;
  margin: 0.5em;
  border-radius: 50%;
  box-shadow: 0 0 1.5em 0.5em rgba(63, 119, 89, 0.7);
`;

const TrackInfo = styled.div`
  margin: 0 auto;
  text-align: center;

  > h2 {
    margin: 1em auto 0.5em;
    font-size: 1.5em;
  }

  p {
    margin: 0.5em 0;
    font-size: 1.2em;
  }
`;

const ControlPanel = styled.div``;
const Controls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 1.2em;
`;

const ControlIcon = styled.div<{ on?: boolean }>`
  margin: 0 1.2em;
  cursor: pointer;

  .icon {
    width: 1.4em;
    height: 1.4em;
  }

  .icon-lg {
    width: 2.4em;
    height: 2.4em;
  }
`;

const VolumeControlIcon = styled(ControlIcon)`
  position: relative;
  margin: 0;
`;

const VerticalPlayer: React.FC<VerticalPlayerProps> = ({ queue }) => {
  const [playerState, setPlayerState] = useState<Spotify.PlaybackState>();
  const [current, setCurrent] = useState<Spotify.Track>();
  const [isMuted, setMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [isShuffle, setShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<number>(0);
  const [play] = usePlayMutation();
  const [shuffle] = useShuffleMutation();
  const [repeat] = useRepeatMutation();

  const { deviceId, player } = usePlayer({
    getOAuthToken: () =>
      fetch('/api/auth/user')
        .then((res) => res.json())
        .then((user) => user.accessToken)
        .catch((err) => console.error(err)),
    onPlayerStateChanged: (state) => {
      setPlayerState(state);
    },
    volume: 0.5,
  });

  useEffect(() => {
    if (!playerState) return;

    const current_track = playerState.track_window.current_track;
    setCurrent(current_track);
    setShuffle(playerState.shuffle);
    setRepeatMode(playerState.repeat_mode);
  }, [playerState]);

  useEffect(() => {
    if (!player || !deviceId || !queue) return;

    const uris = queue.map((track) => track.uri);

    play({
      variables: { deviceId, uris },
    });
  }, [player, deviceId]);

  useEffect(() => {
    if (!player) return;

    if (isMuted) {
      player.setVolume(0.000001);
    } else {
      player.setVolume(volume);
    }
  }, [isMuted, volume]);

  const toggleShuffle = () => {
    if (!deviceId || !playerState) return;

    shuffle({
      variables: { deviceId, state: !playerState.shuffle },
    });
  };

  const toggleRepeat = () => {
    if (!deviceId || !playerState) return;

    repeat({
      variables: {
        deviceId,
        state: repeatMode === 0 ? RepeatMode.Track : RepeatMode.Off,
      },
    });
  };

  return (
    <>
      <Head>
        <script src="https://sdk.scdn.co/spotify-player.js"></script>
      </Head>
      <Container>
        <PlayerContainer>
          <PlayerHeader>
            <h2>Now Playing</h2>
            <VolumeControlIcon>
              {isMuted ? (
                <FaVolumeMute className="icon" />
              ) : (
                <FaVolumeUp className="icon" />
              )}
              <VolumeRangeSlider
                isMuted={isMuted}
                setMuted={setMuted}
                volume={volume}
                setVolume={setVolume}
              />
            </VolumeControlIcon>
          </PlayerHeader>
          {current && (
            <TrackInfo>
              <TrackImage
                src={
                  current.album.images.find((image) => image.height === 300)
                    ?.url
                }
              />
              <h2>{current.name}</h2>
              <p>
                {current.artists
                  .reduce((acc: any[], curr) => [...acc, curr.name], [])
                  .join(',')}
              </p>
            </TrackInfo>
          )}
          <ControlPanel>
            <ProgressBar playerState={playerState} />
            <Controls>
              <ControlIcon on={isShuffle} onClick={toggleShuffle}>
                <BsShuffle className="icon" />
              </ControlIcon>
              <ControlIcon onClick={() => player?.previousTrack()}>
                <BsSkipStartFill className="icon" />
              </ControlIcon>
              <ControlIcon onClick={() => player?.togglePlay()}>
                {playerState?.paused && (
                  <BsPlayCircleFill className="icon-lg" />
                )}
                {!playerState?.paused && (
                  <BsPauseCircleFill className="icon-lg" />
                )}
              </ControlIcon>
              <ControlIcon onClick={() => player?.nextTrack()}>
                <BsSkipEndFill className="icon" />
              </ControlIcon>
              <ControlIcon on={repeatMode !== 0} onClick={toggleRepeat}>
                <BsArrowRepeat className="icon" />
              </ControlIcon>
            </Controls>
          </ControlPanel>
        </PlayerContainer>
        <Queue queue={queue} currentTrack={current} />
      </Container>
    </>
  );
};

export default VerticalPlayer;
