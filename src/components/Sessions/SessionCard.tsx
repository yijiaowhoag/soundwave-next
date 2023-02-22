import Router from 'next/router';
import styled from 'styled-components';
import { IoCloseCircle } from 'react-icons/io5';
import {
  useDeleteSessionMutation,
  SessionsDocument,
} from '../../__generated__/types';
import EditBtn, { EditIcon } from '../SessionForm/EditBtn';

const Overlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 10px;
  background: ${({ theme }) =>
    `linear-gradient(to bottom, transparent, ${theme.colors.lightGreen30})`};
  opacity: 0;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 9rem;
  border-radius: 10px 10px 0 0;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  border-radius: inherit;
  object-fit: cover;
`;

const DefaultImage = styled.div`
  position: relative;
  height: 100%;
  border-radius: 10px 10px 0 0;
  background-color: ${({ theme }) => theme.colors.lightGreen30};

  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 60%;
  }

  .underlay {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 6px;
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 8rem;
`;

const SessionName = styled.h3`
  margin: 1rem;
  margin-bottom: 0.75rem;
  font-size: 18px;
`;

const SessionDesp = styled.p`
  margin: 0 1rem;
  opacity: 0.5;

  &.line-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: keep-all;
  }
`;

const Card = styled.div`
  position: relative;
  width: ${({ theme }) => theme.columns(2)};
  height: 18rem;
  margin-right: 2rem;
  border-radius: 10px 0 10px 10px;
  background-color: ${({ theme }) => theme.colors.lightGreen10};
  box-shadow: 10px 5px 10px 5px ${({ theme }) => theme.shadow.dark};
  cursor: pointer;

  ${EditIcon} {
    position: absolute;
    bottom: 2rem;
    right: 1.5rem;
    z-index: 2;
    width: 55px;
    height: 55px;
    opacity: 0;
  }

  &:hover {
    ${Overlay} {
      opacity: 1;
      transition: opacity 0.8s ${({ theme }) => theme.animations.bezier};
    }

    ${EditIcon} {
      opacity: 1;
      bottom: 1.5rem;
      transition: opacity 0.8s ${({ theme }) => theme.animations.bezier},
        bottom 0.8s ${({ theme }) => theme.animations.bezier};
    }
  }
`;

const DeleteIcon = styled.span`
  position: absolute;
  top: -14px;
  right: -14px;
  width: 32px;
  height: 32px;
  cursor: pointer;

  .icon {
    width: 100%;
    height: 100%;
    fill: ${({ theme }) => theme.colors.lightGreen};
    filter: ${({ theme }) =>
      `drop-shadow(3px 5px 3px ${theme.shadow.darkest})`};
  }
`;

interface SessionCardProps {
  id: string;
  name: string;
  description?: string;
  cover?: string;
}

const SessionCard: React.FC<SessionCardProps> = ({
  id,
  name,
  description,
  cover,
}) => {
  const [deleteSession] = useDeleteSessionMutation({
    variables: { sessionId: id },
    refetchQueries: [{ query: SessionsDocument }],
  });

  return (
    <div
      onClick={() => Router.push(`/sessions/${id}`)}
      className="session-card"
    >
      <Card>
        <Overlay />
        <ImageWrapper>
          {cover ? (
            <Image src={cover} />
          ) : (
            <DefaultImage>
              <img src="/default-session-cover.png" />
              <div className="underlay" />
            </DefaultImage>
          )}
        </ImageWrapper>
        <CardContent>
          <SessionName>{name}</SessionName>
          {description && (
            <SessionDesp className="line-clamp">{description}</SessionDesp>
          )}
          <div className="underlay" />
        </CardContent>
        <DeleteIcon>
          <IoCloseCircle
            onClick={(e) => {
              e.stopPropagation();
              deleteSession({ variables: { sessionId: id } });
            }}
            className="icon"
          />
        </DeleteIcon>
        <EditBtn sessionId={id} initialValues={{ name, description, cover }} />
      </Card>
    </div>
  );
};

export default SessionCard;
