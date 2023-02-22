import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import Portal from './Portal';

interface ModalProps {
  activator: React.ReactElement;
  children: ({ closeModal }: { closeModal: () => void }) => React.ReactElement;
}

interface ModalButtonProps {
  children: React.ReactElement;
  openModal: () => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
  background-color: ${({ theme }) => theme.colors.darkest80};
`;

const ContentContainer = styled.div`
  z-index: 100;
`;

const ModalButton: React.FC<ModalButtonProps> = ({ children, openModal }) => {
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      openModal();
    },
    [openModal]
  );

  return React.Children.only(
    React.cloneElement(children, { onClick: handleClick })
  );
};

const Modal: React.FC<ModalProps> = ({ activator, children }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState<boolean>(false);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (e.target === overlayRef.current) {
        closeModal();
      }
    },
    [closeModal]
  );

  return (
    <>
      <ModalButton openModal={openModal}>{activator}</ModalButton>
      <Portal>
        {open && (
          <Overlay
            ref={overlayRef}
            onClick={handleOverlayClick}
            role="button"
            aria-label="Overlay"
          >
            <ContentContainer>{children({ closeModal })}</ContentContainer>
          </Overlay>
        )}
      </Portal>
    </>
  );
};

export default Modal;
