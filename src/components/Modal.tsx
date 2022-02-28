import React, { cloneElement, useState } from 'react';
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
  z-index: 100;
`;

const ModalButton: React.FC<ModalButtonProps> = ({ children, openModal }) =>
  cloneElement(children, {
    onClick: openModal,
  });

const Modal: React.FC<ModalProps> = ({ activator, children }) => {
  const [open, setOpen] = useState<boolean>(false);

  const openModal = () => setOpen(true);

  const closeModal = () => setOpen(false);

  return (
    <>
      <ModalButton openModal={openModal}>{activator}</ModalButton>
      <Portal>
        {open && (
          <Overlay
            id="modal-overlay"
            onClick={(e) => {
              if ((e.target as Element).id === 'modal-overlay') {
                closeModal();
              }
            }}
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
