import ReactDOM from 'react-dom';
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.darkest80};
`;

const ContentContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
  background-color: ${({ theme }) => theme.colors.lightGreen};
  color: white;
`;

interface PortalProps {
  children: React.ReactNode;
  toggleModal?: () => void;
}

const Portal: React.FC<PortalProps> = ({ children, toggleModal }) => {
  const containerEl = useRef<HTMLDivElement | undefined>();

  useEffect(() => {
    const root: HTMLElement | null = document.getElementById('modal-root');
    const el: HTMLDivElement = document.createElement('div');

    containerEl.current = el;
    root?.appendChild(el);

    return () => {
      root && el && root.removeChild(el);
    };
  }, []);

  return (
    (containerEl.current &&
      ReactDOM.createPortal(children, containerEl.current)) ||
    null
  );
};

const Modal: React.FC<any> = ({ children, activator }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      {activator({ setOpen })}
      <Portal>
        {open && (
          <Overlay
            id="modal-overlay"
            onClick={(e) => {
              if (e.target.id === 'modal-overlay') {
                setOpen(false);
              }
            }}
            role="button"
            aria-label="Overlay"
          >
            <ContentContainer>{children}</ContentContainer>
          </Overlay>
        )}
      </Portal>
    </>
  );
};

export default Modal;
