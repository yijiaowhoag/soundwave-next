import styled from 'styled-components';
import IconButton from './IconButton';
import HeartIcon from './icons/Heart';

interface IProps {
  tracks: Track[];
  onAdd?: (track: Track) => void;
  onRemove?: (track: Track) => void;
}

interface Track {
  id: string;
  name: string;
  artists: [Artist];
  duration_ms: number;
}

interface Artist {
  id: string;
  name: string;
}

const convertDurationMs = (duration_ms: number) => {
  const seconds = Math.floor((duration_ms / 1000) % 60)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((duration_ms / (1000 * 60)) % 60)
    .toString()
    .padStart(2, '0');
  const hours = Math.floor((duration_ms / (1000 * 60 * 60)) % 24)
    .toString()
    .padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
`;

const SingleTrack = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 2.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);

  ul {
    list-style: none;
  }
`;

const TrackName = styled.a`
  width: 40%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackArtists = styled.span`
  width: 30%;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const IconsWrapper = styled.div`
  width: 25px;
  height: 25px;
`;

const Playlist: React.FC<IProps> = ({ tracks, onAdd, onRemove }) => {
  return (
    <Container>
      {tracks.map((track) => (
        <SingleTrack key={track.id}>
          <TrackName>{track.name}</TrackName>
          <TrackArtists>
            {track.artists.reduce((acc, curr) => `${acc} ${curr.name},`, '')}
          </TrackArtists>
          <span>{convertDurationMs(track.duration_ms)}</span>
          {onAdd && (
            <IconsWrapper>
              <IconButton onClick={() => onAdd(track)}>
                <HeartIcon />
              </IconButton>
            </IconsWrapper>
          )}
          {onRemove && (
            <IconsWrapper>
              <IconButton onClick={() => onRemove(track)}>
                <img
                  src="/x.svg"
                  alt="Remove"
                  style={{ width: '100%', height: '100%', padding: 5 }}
                />
              </IconButton>
            </IconsWrapper>
          )}
        </SingleTrack>
      ))}
    </Container>
  );
};

export const HorizontalPlaylist: React.FC<any> = ({ tracks, onAdd }) => {
  return (
    <Container>
      {tracks.map((track: Track) => (
        <SingleTrack key={track.id}>
          <TrackName>{track.name}</TrackName>
          <TrackArtists>
            {track.artists.reduce((acc, curr) => `${acc} ${curr.name},`, '')}
          </TrackArtists>
          <span>{convertDurationMs(track.duration_ms)}</span>
          <IconsWrapper>
            <IconButton onClick={() => onAdd(track)}>
              <HeartIcon />
            </IconButton>
          </IconsWrapper>
        </SingleTrack>
      ))}
    </Container>
  );
};

export default Playlist;
