import styled from 'styled-components';
import { CgClose } from 'react-icons/cg';
import type { OptionType } from './Option';

const ValueContainer = styled.div`
  position: relative;
  display: flex;
  align-items: stretch;
  min-width: 10rem;
  max-width: 20rem;
  margin-right: 10px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.lightGreen};
`;

const ImageContainer = styled.div`
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
`;

const Value = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
`;

const ValueLabel = styled.span`
  display: flex;
  align-items: center;
  max-width: 10rem;
  margin: 0 1rem 0 0.5rem;
  font-weight: bold;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ValueRemove = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 100%;
  cursor: pointer;
  border-radius: 0 5px 5px 0;

  :hover {
    background-color: ${({ theme }) => theme.colors.darkGreen30};
  }

  .icon {
    width: 16px;
    height: 16px;
  }
`;

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
      <ImageContainer>
        <div className="image-overlay" />
        <img src={selected.imageUrl} />
      </ImageContainer>
      <Value>
        <ValueLabel>{selected.label}</ValueLabel>
        <ValueRemove onClick={onRemove}>
          <CgClose className="icon" />
        </ValueRemove>
      </Value>
    </ValueContainer>
  );
};

export default CustomValue;
