import styled from 'styled-components';
import { RiDeleteBack2Line } from 'react-icons/ri';
import type { OptionType } from './Option';

const ValueContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  min-width: 10rem;
  max-width: 20rem;
  margin-right: 10px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.lightGreen};
  font-weight: bold;
  font-size: 18px;

  .image-container {
    position: relative;
    width: 45px;
    height: 45px;

    .image-overlay {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      border-radius: 5px 0 0 5px;
      background: ${({ theme }) =>
        `linear-gradient(45deg, ${theme.colors.spotifyGreen}, ${theme.colors.lightGreen30})`};
      opacity: 0.7;
    }

    img {
      width: 100%;
      height: 100%;
      border-radius: 5px 0 0 5px;
    }
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ValueRemove = styled.span``;

interface CustomValueProps {
  selected: OptionType;
  onRemoveValue: (selected: OptionType) => void;
}
const CustomValue: React.FC<CustomValueProps> = ({
  selected,
  onRemoveValue,
}) => {
  const onRemove: React.MouseEventHandler = () => {
    onRemoveValue(selected);
  };

  return (
    <ValueContainer>
      <div className="image-container">
        <div className="image-overlay" />
        <img src={selected.imageUrl} />
      </div>
      <span>{selected.label}</span>
      <ValueRemove onClick={onRemove}>
        <RiDeleteBack2Line />
      </ValueRemove>
    </ValueContainer>
  );
};

export default CustomValue;
