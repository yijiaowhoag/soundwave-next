import { forwardRef, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import '@szhsin/react-menu/dist/index.css';
import {
  ControlledMenu,
  useMenuState,
  MenuItem,
  MenuDivider,
  SubMenu,
  FocusableItem,
} from '@szhsin/react-menu';
import {
  menuSelector,
  menuItemSelector,
  menuDividerSelector,
} from '@szhsin/react-menu/style-utils';
import '@szhsin/react-menu/dist/core.css';
import { BsThreeDots } from 'react-icons/bs';
import { useSessionsQuery } from '../generated/graphql';

interface MenuProps {
  onAdd: (sessionId: string) => void;
}

const menuShow = keyframes`
  from {
    opacity: 0;
  }
`;
const menuHide = keyframes`
  to {
    opacity: 0;
  }
`;

const MenuButton = styled.div`
  width: 20px;
  height: 20px;
  margin-left: 1rem;
  z-index: 10;
  cursor: pointer;

  .menu-icon {
    width: 100%;
    height: 100%;
  }
`;

const StyledMenu = styled(ControlledMenu)`
  ${menuSelector.name} {
    width: 200px;
    border-radius: 5px;
    border: 1px solid ${({ theme }) => theme.colors.green};
    box-shadow: 0 10px 20px ${({ theme }) => theme.shadow.darkest};
    background-color: ${({ theme }) => theme.colors.green};
  }

  ${menuSelector.stateOpening} {
    animation: ${menuShow} 0.25s ease-in;
  }

  ${menuSelector.stateClosing} {
    animation: ${menuHide} 0.25s ease-out forwards;
  }

  ${menuItemSelector.name} {
    padding: 0.8rem;
    font-size: 14px;
    white-space: nowrap;

    span {
      max-width: 100%;
      overflow: auto;
      text-overflow: ellipsis;
    }
  }

  ${menuItemSelector.hover} {
    background-color: ${({ theme }) => theme.colors.lightGreen30};
    color: white;
  }

  ${menuItemSelector.focusable} {
    padding: 0.8rem 0;
    
    input {
      width: 100%;
      padding: 0.8rem;
      border: none;
      background-color: ${({ theme }) => theme.colors.darkGreen30};
      outline: none;
    }
  }

  ${menuItemSelector.submenu} {
    position: relative;

    &::after {
      content: '>',
      position: absolute;
      width: 7px;
      right: 0.625rem;
    }
  }

  ${menuDividerSelector.name} {
    margin: 0;
    background-color: ${({ theme }) => theme.colors.lightGreen30};
  }
`;

const Menu: React.FC<MenuProps> = forwardRef(({ onAdd }, ref) => {
  const [menuProps, toggleMenu] = useMenuState({ transition: true });
  const anchorRef = useRef<HTMLDivElement>(null);
  const skipOpen = useRef(false);
  const [filter, setFilter] = useState('');
  const { data, loading } = useSessionsQuery();

  return (
    <>
      <MenuButton
        ref={anchorRef}
        onClick={(e) => {
          e.stopPropagation();
          !skipOpen.current && toggleMenu();
        }}
      >
        <BsThreeDots className="menu-icon" />
      </MenuButton>
      <StyledMenu
        {...menuProps}
        anchorRef={anchorRef}
        boundingBoxRef={ref}
        onClose={({ reason }) => {
          if (reason === 'blur') {
            skipOpen.current = true;
            setTimeout(() => (skipOpen.current = false), 300);
          }
          toggleMenu(false);
        }}
        align="start"
        direction="right"
        offsetX={10}
        offsetY={10}
        overflow="auto"
        position="anchor"
        reposition="initial"
        viewScroll="close"
      >
        <MenuItem>Add to queue</MenuItem>
        <MenuDivider />
        <MenuItem>Go to song radio</MenuItem>
        <MenuItem>Go to artist</MenuItem>
        <MenuItem>Go to album</MenuItem>
        <SubMenu
          label="Add to session"
          onMenuChange={(e) => e.open && setFilter('')}
          align="center"
          overflow="auto"
          position="auto"
        >
          <FocusableItem>
            {({ ref }) => (
              <input
                ref={ref}
                placeholder="Filter by session name"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            )}
          </FocusableItem>
          <MenuDivider />
          {loading && <MenuItem>Loading...</MenuItem>}
          {data?.sessions
            .filter((session) =>
              session.name.toLowerCase().includes(filter.trim().toLowerCase())
            )
            .map((session) => (
              <MenuItem key={session.id} onClick={() => onAdd(session.id)}>
                <span>{session.name}</span>
              </MenuItem>
            ))}
        </SubMenu>
        <MenuDivider />
        <MenuItem>Share</MenuItem>
      </StyledMenu>
    </>
  );
});

export default Menu;
