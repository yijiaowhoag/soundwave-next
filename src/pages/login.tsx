import Link from 'next/link';
import styled from 'styled-components';
import { FaSpotify } from 'react-icons/fa';
import Layout from '../components/Layout';

const LoginButton = styled.button`
  height: 48px;
  margin: auto;
  border: none;
  border-radius: 32px;
  box-shadow: 0 4px 14px 0 rgb(0 0 0 / 10%);
  padding: 12px 32px;
  background-color: white;
  color: black;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;

  &:focus {
    outline: 0;
  }

  .icon {
    width: 20px;
    height: 20px;
    margin-right: 5px;
    vertical-align: text-bottom;
    fill: ${({ theme }) => theme.colors.spotifyGreen};
  }
`;

const Login = () => (
  <Layout>
    <Link href="/api/auth/login">
      <LoginButton>
        <FaSpotify className="icon" />
        Sign in with Spotify
      </LoginButton>
    </Link>
  </Layout>
);

export default Login;
