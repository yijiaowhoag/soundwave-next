import Router from 'next/router';
import styled from 'styled-components';
import { TiDelete } from 'react-icons/ti';
import {
  useDeleteSessionMutation,
  SessionsDocument,
} from '../generated/graphql';
import IconButton from './IconButton';

const Card = styled.div`
  position: relative;
  width: ${({ theme }) => theme.columns(2)};
  height: ${({ theme }) => theme.columns(2.5)};
  margin-right: 2rem;
  border-radius: 12px;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 10px 5px 10px 5px ${({ theme }) => theme.colors.darkGreen};

  &:hover {
  }
`;

const IconsWrapper = styled.div`
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
    refetchQueries: [{ query: SessionsDocument }],
  });

  return (
    <div
      onClick={() => Router.push(`/sessions/${id}`)}
      className="session-card"
    >
      <Card>
        <h3>{name}</h3>
        <IconsWrapper>
          <IconButton
            onClick={() => deleteSession({ variables: { sessionId: id } })}
          >
            <TiDelete className="delete-icon" />
          </IconButton>
        </IconsWrapper>
      </Card>
    </div>
  );
};

export default SessionCard;
