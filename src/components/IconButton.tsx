import React from 'react';
import styled from 'styled-components';

interface IProps {
  onClick: () => void;
}

const Button = styled.button`
  border: 0;
  padding: 0;
  background: none;
`;

const IconButton: React.FunctionComponent<IProps> = ({ children, onClick }) => (
  <Button onClick={onClick}>{children}</Button>
);

export default IconButton;
