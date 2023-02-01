import { useState, useEffect } from 'react';
import styled from 'styled-components';
import InputRange from './InputRange';

const Container = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  width: ${({ theme }) => theme.columns(3)};
  min-width: 320px;
  height: 100%;
  padding: 0 1.5rem;

  .gradient-text {
    background: ${({ theme }) =>
      `linear-gradient(to right, ${theme.colors.spotifyGreen}, ${theme.colors.lightGreen})`};
    background-size: 100%;
    background-repeat: repeat;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

interface AudioFiltersProps {
  onChange: (filter: { [key: string]: number }) => void;
}

const AudioFilters: React.FC<AudioFiltersProps> = ({ onChange }) => {
  const [filters, setFilters] = useState({});

  useEffect(() => {
    onChange(filters);
  }, [filters]);

  return (
    <Container>
      <h3 className="gradient-text">Audio Features</h3>
      {[
        'acousticness',
        'danceability',
        'energy',
        'liveness',
        'tempo',
        'valence',
      ].map((name) => (
        <InputRange
          key={name}
          minValue={0}
          maxValue={1}
          step={0.01}
          name={name}
          onChange={({ name, value }) => {
            if (typeof value === 'number') {
              setFilters({ [`target_${name}`]: value });
            } else {
              setFilters({
                [`min_${name}`]: value.min,
                [`max_${name}`]: value.max,
              });
            }
          }}
        />
      ))}
    </Container>
  );
};

export default AudioFilters;
