import styled from 'styled-components';
import { User as CurrUser } from '../../__generated__/types';
import Modal from '../shared/Modal';
import ProfileForm from '.';

const User = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.25rem 1.5rem 0.25rem 0.75rem;
  cursor: pointer;

  .underlay {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
    background: ${({ theme }) =>
      `linear-gradient(to right, ${theme.colors.lightGreen75}, ${theme.colors.darkest})`};
    opacity: 0;
  }

  &:hover {
    .underlay {
      opacity: 0.8;
      transition: opacity 1s ${({ theme }) => theme.animations.bezier};
    }
  }
`;

const UserPhoto = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 0.75rem;
  border-radius: 10px;
  object-fit: cover;
`;

const DisplayName = styled.h4``;

interface EditBtnProps {
  currUser: CurrUser;
}

const EditBtn: React.FC<EditBtnProps> = ({ currUser }) => {
  return (
    <Modal
      activator={
        <User>
          <UserPhoto src={currUser.avatar} />
          <DisplayName>{currUser.display_name}</DisplayName>
          <div className="underlay" />
        </User>
      }
    >
      {({ closeModal }) => (
        <ProfileForm
          initialValues={{
            display_name: currUser.display_name,
            avatar: currUser.avatar,
            email: currUser.email,
          }}
          onClose={closeModal}
        />
      )}
    </Modal>
  );
};

export default EditBtn;
