import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  top: calc(var(--headerHeight) / 2);
  bottom: 0;
  right: 0;
  z-index: 2;
  width: var(--playerWidth);
  height: 100%;
  min-height: 595px;
  border-radius: 45px 0 0 0;
  background: ${({ theme }) =>
    `linear-gradient(to bottom, ${theme.colors.green}, ${theme.colors.lightGreen75} 75%)`};
`;

const PlayerContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <Container>{children}</Container>;
};

export default PlayerContainer;
