import { useState } from 'react';
import styled from 'styled-components';

interface IProps {
  width: number;
  height?: string;
  children: React.ReactNode;
}

const ContentContainer = styled.div<{
  width: number;
  height: string;
  xPosition: number;
}>`
  position: absolute;
  right: 0;
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => height};
  padding: 1rem;
  transform: ${({ xPosition }) => `translateX(${xPosition}px)`};
  transition: 800ms ease;
  background: hotpink;
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

const Sidebar: React.FC<IProps> = ({ width, height = '100%', children }) => {
  const [xPosition, setX] = useState<number>(width);

  const toggleSidebar = () => {
    if (xPosition > 0) {
      setX(0);
    } else {
      setX(width);
    }
  };

  return (
    <ContentContainer width={width} height={height} xPosition={xPosition}>
      <Button onClick={toggleSidebar}>
        <a>
          <img src="/left-arrow.svg" alt="Expand Icon" />
          <span>Suggest Music</span>
        </a>
      </Button>
      {children}
    </ContentContainer>
  );
};

export default Sidebar;
