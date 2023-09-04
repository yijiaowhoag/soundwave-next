import styled from 'styled-components';

const ErrorMessage = styled.div`
  height: 7.5em;
  margin-top: 2rem;
  padding: 4rem 2rem;
  background-color: ${({ theme }) => theme.colors.lightGreen30};

  > p {
    font-size: 18px;
  }
`;

interface ErrorProps {
  error: any;
}

const Error: React.FC<ErrorProps> = ({ error }) => {
  return (
    <ErrorMessage>
      <p>An error has occured.</p>
      {error?.message && <p>{error.message}</p>}
    </ErrorMessage>
  );
};

export default Error;
