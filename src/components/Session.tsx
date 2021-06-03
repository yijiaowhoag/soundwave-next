import Link from 'next/link';
import styled from 'styled-components';

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/^\s+|\s+$/g, '')
    .replace(/\s+/g, '-')
    .replace(/\-\-+/g, '-')
    .replace(/[^\w\-]+/g, '');

export const SessionCard = styled.div`
  width: ${({ theme }) => theme.columns(2)};
  height: ${({ theme }) => theme.columns(2.5)};
  margin-right: 2rem;
  border-radius: 12px;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 10px 5px 10px 5px ${({ theme }) => theme.colors.darkGreen};
`;

interface IProps {
  id: string;
  name: string;
}

const Session: React.FC<IProps> = ({ id, name }) => {
  return (
    <Link href={`/sessions/${id}`}>
      <SessionCard>
        <h3>{name}</h3>
      </SessionCard>
    </Link>
  );
};

export default Session;
