import styled from 'styled-components';

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.darkGreen};
  font-size: 16px;
`;

export default Button;
