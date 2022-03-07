import styled from 'styled-components';
import { useSessionsQuery } from '../generated/graphql';
import SessionCard from './SessionCard';

const SessionsDiv = styled.div`
  width: 100%;
  padding: 5rem 0 2rem 0;
  overflow: auto;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1));

  ul {
    display: flex;
    width: fit-content;
    padding: 0;
    list-style: none;

    li:first-child {
      margin-left: 0;
    }
  }
`;

const Sessions: React.FC = () => {
  const { data, loading } = useSessionsQuery();

  return (
    <SessionsDiv>
      {loading && <p>Loading...</p>}
      {data?.sessions && data.sessions.length > 0 ? (
        <ul>
          {data.sessions.map((session) => (
            <li key={session.id}>
              <SessionCard {...session} />
            </li>
          ))}
        </ul>
      ) : (
        <p>
          <span>You do not have any session.</span>
        </p>
      )}
    </SessionsDiv>
  );
};

export default Sessions;
