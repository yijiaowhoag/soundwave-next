import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { HiHome, HiOutlineHome } from 'react-icons/hi';
import { RiSearch2Fill, RiSearch2Line } from 'react-icons/ri';
import { BsPlusCircle, BsSuitHeartFill, BsSuitHeart } from 'react-icons/bs';
// import { useMeQuery } from '../../__generated__/types';
import { useAuth } from '../../contexts/AuthContext';
import Modal from './Modal';
import SessionForm from '../SessionForm';
import theme from '../../theme';

const SIDEBAR_WIDTH = '20.5vw';

const Sidebar = styled.div`
  position: fixed;
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: ${SIDEBAR_WIDTH};
  height: 100%;
  background-color: ${({ theme }) => theme.colors.darkGreen};

  &:after {
    content: '';
    position: absolute;
    top: -5rem;
    bottom: -5rem;
    right: 0;
    z-index: -1;
    width: ${SIDEBAR_WIDTH};
    box-shadow: 12px 0 25px ${({ theme }) => theme.shadow.darkest};
    background-color: ${({ theme }) => theme.colors.lightGreen10};
  }
`;

const Nav = styled.nav`
  margin-top: calc(${SIDEBAR_WIDTH} + 4px);
`;

const NavLink = styled.a<{ active?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  ${({ active, theme }) =>
    active &&
    `background: linear-gradient(to right, ${theme.colors.lightGreen30}, transparent); color: ${theme.colors.spotifyGreen}`};

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background-color: ${({ active, theme }) =>
      active ? theme.colors.spotifyGreen : 'transparent'};
  }

  &:hover {
  }

  span {
    font-size: 14px;
    ${({ active, theme }) =>
      active && `color: ${theme.colors.spotifyGreen}; font-weight: bold;`};
  }

  .icon {
    ${({ active, theme }) => active && `fill: ${theme.colors.spotifyGreen};`}
  }
`;

const NavIconWrapper = styled.div`
  margin-right: 1rem;
  width: 20px;
  height: 20px;

  .icon {
    width: 100%;
    height: 100%;
  }
`;

const Divider = styled.span`
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.lightGreen10};
`;

const LogoBkg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: ${({ theme }) => theme.columns(2.5)};
  background-color: ${({ theme }) => theme.colors.darkGreen};
`;

const Logo = styled.div`
  height: 100%;
  background-image: url('/soundwave.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: top right;
`;

const User = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.25rem 1.5rem 0.25rem 0.75rem;
  cursor: pointer;
`;

const UserPhoto = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 0.75rem;
  border-radius: 10px;
`;

const DisplayName = styled.h4``;

const Navbar: React.FC = () => {
  const auth = useAuth();
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/auth/logout');
    router.push('/auth/login');
  };

  return (
    <Sidebar>
      <LogoBkg>
        <Logo />
      </LogoBkg>
      <Nav>
        {auth?.user && (
          <User>
            <UserPhoto src={auth.user.avatar} />
            <DisplayName>{auth.user.name}</DisplayName>
          </User>
        )}
        <Link href="/dashboard" passHref legacyBehavior>
          <NavLink
            active={router.pathname === '/dashboard'}
            className="nav-link"
          >
            <NavIconWrapper>
              {router.pathname === '/dashboard' ? (
                <HiHome className="icon" />
              ) : (
                <HiOutlineHome className="icon" />
              )}
            </NavIconWrapper>
            <span>Home</span>
          </NavLink>
        </Link>
        <Link href="/" passHref legacyBehavior>
          <NavLink active={router.pathname === '/'}>
            <NavIconWrapper>
              {router.pathname === '/' ? (
                <RiSearch2Fill className="icon" />
              ) : (
                <RiSearch2Line className="icon" />
              )}
            </NavIconWrapper>
            <span>Search</span>
          </NavLink>
        </Link>
        <Divider />
        <Modal
          activator={
            <NavLink>
              <NavIconWrapper>
                <BsPlusCircle className="icon" />
              </NavIconWrapper>
              <span>Create Session</span>
            </NavLink>
          }
        >
          {({ closeModal }) => <SessionForm onClose={closeModal} />}
        </Modal>
        <Link href="/liked" passHref legacyBehavior>
          <NavLink active={router.pathname === '/liked'}>
            <NavIconWrapper>
              {router.pathname === '/liked' ? (
                <BsSuitHeartFill
                  className="icon"
                  color={theme.colors.spotifyGreen}
                />
              ) : (
                <BsSuitHeart className="icon" />
              )}
            </NavIconWrapper>
            <span>Liked</span>
          </NavLink>
        </Link>
      </Nav>
    </Sidebar>
  );
};

export default Navbar;
