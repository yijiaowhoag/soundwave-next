import { useRouter } from 'next/router';
import styled, { CSSProperties } from 'styled-components';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  styleProps?: CSSProperties;
}

const NAVBAR_WIDTH = '20.5vw';

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.darkGreen};
  overflow-x: hidden;

  * {
    color: white;
  }
`;

const Main = styled.main`
  position: relative;
  flex: 1;
  margin-left: ${NAVBAR_WIDTH};
`;

const Layout: React.FC<LayoutProps> = ({ children, styleProps }) => {
  const router = useRouter();

  return (
    <Container style={styleProps}>
      {!router.pathname.startsWith('/auth') && (
        <>
          <Navbar />
          <Main>{children}</Main>
        </>
      )}
    </Container>
  );
};

export default Layout;
