import Link from 'next/link';
import styled from 'styled-components';
import { FaSpotify } from 'react-icons/fa';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.green};
`;

const Logo = styled.img`
  width: 30rem;
  height: 30rem;
  margin-bottom: 1rem;
`;

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  height: 48px;
  border: none;
  border-radius: 32px;
  box-shadow: 0 5px 15px 0 rgb(0 0 0 / 50%);
  padding: 12px 32px;
  background-color: white;
  color: black !important;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;

  &:focus {
    outline: 0;
  }

  .icon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    fill: ${({ theme }) => theme.colors.spotifyGreen};
  }
`;

const Login = () => {
  return (
    <Container>
      <Logo src="/soundwave.png" />
      <Link href="/api/auth/login">
        <LoginButton>
          <FaSpotify className="icon" />
          Sign in with Spotify
        </LoginButton>
      </Link>
    </Container>
  );
};

export default Login;
