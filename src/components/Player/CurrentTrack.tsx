import styled from 'styled-components';

const TrackImage = styled.img`
  width: 8.5em;
  height: 8.5em;
  margin: 0.5em;
  border-radius: 5px;
`;

const TrackInfo = styled.div`
  margin: 0 auto;
  text-align: center;
  text-shadow: 3px 3px 2px ${({ theme }) => theme.shadow.darkest};

  h2 {
    margin: 1em auto 0.5em;
    font-size: 1.5em;
    line-height: 1.5em;
  }

  p {
    margin: 0.5em 0;
    font-size: 1.2em;
    opacity: 0.7;
  }
`;

interface CurrentTrackProps {
  name?: string;
  artists?: string;
  cover?: string;
}

const CurrentTrack: React.FC<CurrentTrackProps> = ({
  name,
  artists,
  cover,
}) => {
  return (
    <TrackInfo>
      <TrackImage src={cover || '/default-session-cover.png'} />
      <h2>{name ?? 'Unavailable'}</h2>
      <p>{artists ?? 'Unavailable'}</p>
    </TrackInfo>
  );
};

export default CurrentTrack;
