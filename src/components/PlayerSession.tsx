import { useState } from 'react';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;

  > div:first-child {
    width: ${({ theme }) => theme.columns(5)};
  }
`;

const Button = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  width: 150px;
  height: 64px;
  border: none;
  transform: translateX(-150px);
  background-color: ${({ theme }) => theme.colors.lightGreen};

  &:before {
    content: '';
    position: absolute;
    left: -64px;
    top: 0;
    z-index: -1;
    background-color: inherit;
    width: 64px;
    height: 64px;
    border-bottom-left-radius: 64px;
  }

  > a {
    position: absolute;
    left: -32px;
    top: 50%;
    transform: translate(0, -50%);
    display: flex;
    align-items: center;
    font-size: 18px;
    white-space: nowrap;

    > img {
      width: 32px;
      height: 32px;
      margin-right: 15px;
    }
  }
`;

interface IProps {
  Player: React.ReactNode;
  LeftSidebar: React.ReactNode;
  RightSidebar: React.ReactNode;
}

const PlayerSession: React.FC<IProps> = ({
  Player,
  LeftSidebar,
  RightSidebar,
}) => {
  const [leftOpen, setLeftOpen] = useState()
  const [rightOpen, setRightOpen] = useState()
  const [xLeft, setXLeft] = useState(-450)
  const [xRight, setRight] = useState(450)

  const toggleLeftSidebar = () => {
    if (xLeft < 0) {
      setXLeft(0);
    } else {
      setX(-width);
    }
  };

  const toggleBothSidebars = () => {
    if (xRight >)
  }

  return (
    <Container>
      {Player}
      <Sidebar width={450} side="left">
        <Button onClick={toggleLeftSidebar}>
          <a>
            <img src="/left-arrow.svg" alt="Expand Icon" />
            <span>Playlist</span>
          </a>
        </Button>
        {LeftSidebar}
      </Sidebar>
      <Sidebar width={450} side="right">
        <Button onClick={toggleBothSidebars}>
          <a>
            <img src="/left-arrow.svg" alt="Expand Icon" />
            <span>Suggest Music</span>
          </a>
        </Button>
        {RightSidebar}
      </Sidebar>
    </Container>
  );
};

export default PlayerSession;
