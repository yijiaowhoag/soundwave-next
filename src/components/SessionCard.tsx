import Router from 'next/router';
import styled from 'styled-components';
import { TiDelete } from 'react-icons/ti';
import { BsPlayCircleFill } from 'react-icons/bs';
import {
  useDeleteSessionMutation,
  SessionsDocument,
} from '../generated/graphql';

const Overlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 12px;
  background: ${({ theme }) =>
    `linear-gradient(to bottom, transparent, ${theme.colors.lightGreen30})`};
  opacity: 0;
`;

const PlayIconWrapper = styled.div`
  position: absolute;
  bottom: 2.5rem;
  left: 50%;
  transform: translate(-50%);
  width: 64px;
  height: 64px;
  border-radius: 100%;
  box-shadow: 0 10px 15px ${({ theme }) => theme.shadow.dark};
  background-color: white;
  opacity: 0;

  .play-icon {
    width: 100%;
    height: 100%;
    fill: ${({ theme }) => theme.colors.spotifyGreen};
    cursor: pointer;
  }
`;

const Card = styled.div`
  position: relative;
  width: ${({ theme }) => theme.columns(2)};
  height: ${({ theme }) => theme.columns(2.5)};
  margin-right: 2rem;
  border-radius: 12px;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 10px 5px 10px 5px ${({ theme }) => theme.colors.darkGreen};
  cursor: pointer;

  &:hover {
    ${Overlay} {
      opacity: 1;
      transition: opacity 0.8s ${({ theme }) => theme.animations.bezier};
    }

    ${PlayIconWrapper} {
      opacity: 1;
      bottom: 2rem;
      transition: opacity 0.8s ${({ theme }) => theme.animations.bezier},
        bottom 0.8s ${({ theme }) => theme.animations.bezier};
    }
  }

  h3 {
    position: relative;
    z-index: 1;
  }
`;

const DeleteIconWrapper = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;

  .delete-icon {
    width: 28px;
    height: 28px;
    fill: ${({ theme }) => theme.colors.lightGreen};
    cursor: pointer;
  }
`;

interface SessionCardProps {
  id: string;
  name: string;
}

const SessionCard: React.FC<SessionCardProps> = ({ id, name }) => {
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
        <h3>{name}</h3>
        <DeleteIconWrapper>
          <TiDelete
            onClick={(e) => {
              e.stopPropagation();
              deleteSession({ variables: { sessionId: id } });
            }}
            className="delete-icon"
          />
        </DeleteIconWrapper>
        <PlayIconWrapper>
          <BsPlayCircleFill
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="play-icon"
          />
        </PlayIconWrapper>
      </Card>
    </div>
  );
};

export default SessionCard;
