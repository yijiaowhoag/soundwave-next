import { useEffect } from 'react';
import styled from 'styled-components';
import usePlayer from '../hooks/usePlayer';
import IconButton from './IconButton';

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${({ theme }) => theme.columns(7.5)};
  height: 75vh;
`;

const TrackInfo = styled.div`
  margin: 0 auto;
  text-align: center;

  > h2 {
    margin-bottom: 0;
    color: white;
    font-weight: bold;
    font-size: 36px;
  }

  p {
    margin: 1rem;
    font-size: 16px;
  }
`;

const ImageContainer = styled.div``;

const TrackImage = styled.img`
  width: 240px;
  border-radius: 50%;
  box-shadow: 0 0 30px 12px rgba(63, 119, 89, 0.7);
`;

const ControlPanel = styled.div`
  margin: auto;
`;

const Controls = styled.div`
  width: 100%;
  height: 15%;
  margin: 0;
`;

const ControlIcon = styled.img`
  width: 50px;
  height: 50px;
  margin: 0 1em;
`;

const ControlIconLarge = styled.img`
  width: 68px;
  height: 68px;
  margin: 0 1em;
`;

interface IProps {
  token: string;
  queue: any;
  uris?: string[];
}

const Player: React.FC<IProps> = ({ token, queue }) => {
  const {
    player,
    deviceId,
    playerError,
    playerState,
  }: {
    player: Spotify.Player | undefined;
    deviceId: string | undefined;
    playerError: Spotify.Error | undefined;
    playerState: Spotify.PlaybackState | undefined;
  } = usePlayer(token);

  const uris = queue?.map((track) => track.uri);

  const play = ({
    spotify_uris,
    playerInstance: {
      _options: { getOAuthToken },
    },
  }: {
    spotify_uris: string[];
    playerInstance: Spotify.Player;
  }) => {
    getOAuthToken((token: string) => {
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: spotify_uris }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    });
  };

  const start = () => {
    play({
      playerInstance: player!,
      spotify_uris: uris,
    });
  };

  const togglePlaylist = () => {};

  useEffect(() => {
    if (!player) return;

    player.connect().then((success) => {
      if (success) {
        console.log('Web SDK successfully connected to Spotify');
      }
    });
  }, [player, deviceId]);

  console.log('playerState', playerState);
  console.log('playerError', playerError);

  const current = playerState?.track_window?.current_track;
  const next = playerState?.track_window?.next_tracks;
  const prev = playerState?.track_window?.previous_tracks;

  return (
    <Container>
      {current && (
        <TrackInfo>
          <ImageContainer>
            <TrackImage src={current.album.images[0].url} />
          </ImageContainer>
          <h2>{current.name}</h2>
          <p>
            {current.artists
              .reduce((acc: any[], curr) => [...acc, curr.name], [])
              .join(',')}
          </p>
        </TrackInfo>
      )}
      {player && (
        <ControlPanel>
          <Controls>
            <IconButton onClick={() => player.previousTrack()}>
              <ControlIcon src="/backward.svg" />
            </IconButton>
            <IconButton onClick={start}>
              <ControlIcon src="/play.svg" />
            </IconButton>
            <IconButton onClick={() => player.pause()}>
              <ControlIcon src="/pause.svg" />
            </IconButton>
            <IconButton onClick={togglePlaylist}>
              <ControlIcon src="/menu.svg" />
            </IconButton>

            <ControlIcon src="/shuffle.svg" />
            <IconButton onClick={() => player.nextTrack()}>
              <ControlIcon src="/forward.svg" />
            </IconButton>
          </Controls>
        </ControlPanel>
      )}
    </Container>
  );
};

export default Player;
