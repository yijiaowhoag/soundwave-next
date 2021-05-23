import styled from 'styled-components';

const Container = styled.main`
  display: flex;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.darkest};

  * {
    color: white;
  }
`;

const Layout: React.FC<any> = ({ children }) => (
  <Container>{children}</Container>
);

export default Layout;
