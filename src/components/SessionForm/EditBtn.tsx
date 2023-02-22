import React from 'react';
import styled, { css } from 'styled-components';
import { GrEdit } from 'react-icons/gr';
import Modal from '../shared/Modal';
import SessionForm from '../SessionForm';

type EditIconStyle = 'fill' | 'outline';

export const EditIcon = styled.div<{ editIconStyle: EditIconStyle }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3em;
  height: 3em;
  border-radius: 100%;
  box-shadow: 5px 10px 15px ${({ theme }) => theme.shadow.darkest};

  ${({ editIconStyle, theme }) =>
    editIconStyle === 'outline'
      ? css`
          border: 1.5px white solid;
          background-color: transparent;
          opacity: 0.8;
        `
      : css`
          background-color: ${theme.colors.spotifyGreen};
        `};

  cursor: pointer;

  .edit-icon path {
    ${({ editIconStyle, theme }) =>
      editIconStyle === 'outline'
        ? css`
            fill: transparent;
            stroke: white;
            stroke-width: 1.5px;
          `
        : css`
            fill: white;
            stroke: ${theme.colors.green};
          `}
  }
`;

interface EditBtnProps {
  sessionId: string;
  initialValues: {
    name: string;
    description?: string;
    cover?: string;
  };
  editIconStyle?: EditIconStyle;
}

const EditBtn: React.FC<EditBtnProps> = ({
  sessionId,
  initialValues,
  ...props
}) => {
  return (
    <Modal
      activator={
        <EditIcon
          className="icon-wrapper"
          editIconStyle={props.editIconStyle ?? 'fill'}
        >
          <GrEdit className="edit-icon" size="1.5em" />
        </EditIcon>
      }
    >
      {({ closeModal }) => (
        <SessionForm
          sessionId={sessionId}
          initialValues={initialValues}
          onClose={closeModal}
        />
      )}
    </Modal>
  );
};

export default EditBtn;
