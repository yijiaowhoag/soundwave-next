import styled from 'styled-components';
import InputRange from './MultiRangeSlider';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
`;

interface AudioFiltersProps {
  onFiltersUpdate: (filterObj: object) => void;
}

const AudioFilters: React.FC<AudioFiltersProps> = ({ onFiltersUpdate }) => (
  <>
    <Container>
      <InputRange
        minValue={0}
        maxValue={100}
        name="acousticness"
        onUpdate={onFiltersUpdate}
      />
      <InputRange
        minValue={0}
        maxValue={100}
        name="danceability"
        onUpdate={onFiltersUpdate}
      />
      <InputRange
        minValue={0}
        maxValue={100}
        name="energy"
        onUpdate={onFiltersUpdate}
      />
      <InputRange
        minValue={0}
        maxValue={100}
        name="liveness"
        onUpdate={onFiltersUpdate}
      />
      <InputRange
        minValue={0}
        maxValue={100}
        name="tempo"
        onUpdate={onFiltersUpdate}
      />
      <InputRange
        minValue={0}
        maxValue={100}
        name="valence"
        onUpdate={onFiltersUpdate}
      />
    </Container>
  </>
);

export default AudioFilters;
