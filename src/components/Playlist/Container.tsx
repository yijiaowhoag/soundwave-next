import styled from 'styled-components';

const Container = styled.div`
  width: calc(100% - var(--playerWidth));
  padding: 0;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const PlaylistContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <Container>{children}</Container>;
};

export default PlaylistContainer;
