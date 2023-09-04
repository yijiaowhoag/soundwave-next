import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const color = keyframes`
  0%, 100% {
    stroke: #1db954;
  }
  25% {
    stroke: #522dc8;
  }
  50% {
    stroke: #311b78;
  }
  75% {
    stroke: #1db954;
  }
`;

const dash = keyframes`
  0% {
    stroke-dasharray: 1,200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharry: 89,200;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 89,200;
    stroke-dashoffset: -124;
  }
`;

const Spinner = styled.div`
  width: 200px;
  height: 200px;
  margin-top: 2.5rem;
  padding: 2rem;

  .spinner {
    animation: ${rotate} 1.5s linear infinite;

    circle {
      fill: none;
      stroke: ${({ theme }) => theme.colors.spotifyGreen};
      stroke-width: 3;
      stroke-linecap: round;
      animation: ${color} 6s ease-in-out infinite,
        ${dash} 1.5s ease-in-out infinite;
    }
  }
`;

const LoadingSpinner: React.FC = () => {
  return (
    <Spinner>
      <svg className="spinner" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="20" strokeWidth="5"></circle>
      </svg>
    </Spinner>
  );
};

export default LoadingSpinner;
