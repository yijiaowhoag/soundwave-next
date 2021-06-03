import Router from 'next/router';
import styled from 'styled-components';
import { useGetSessions } from '../graphql/queries';
import Session, { SessionCard } from './Session';

const SessionsDiv = styled.div`
  width: calc(100% - 2.5rem);
  border-radius: 0 24px 24px 0;
  padding: 5rem 0 2rem 0;
  overflow: auto;
  background-color: rgba(255, 255, 255, 0.1);
`;

const Sessions = styled.div`
  display: flex;
  width: fit-content;

  > ${SessionCard}:first-child {
    margin-left: 4rem;
  }
`;

const AllSessions: React.FC = () => {
  const { data, loading, error } = useGetSessions();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error?.graphQLErrors && error.graphQLErrors.length > 0) {
    error.graphQLErrors.map((err) => {
      if (err.extensions?.code === 'UNAUTHENTICATED') {
        Router.push('/login');
      }
    });
  }

  if (!data?.sessions) return null;

  return (
    <SessionsDiv>
      {data.sessions.length !== 0 ? (
        <Sessions>
          {data.sessions.map((session) => (
            <Session key={session.id} {...session} />
          ))}
        </Sessions>
      ) : (
        <p>
          <span>You do not have any session.</span>
          <span>Create new session</span>
        </p>
      )}
    </SessionsDiv>
  );
};

export default AllSessions;
