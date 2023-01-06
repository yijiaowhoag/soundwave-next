import styled from 'styled-components';

const ButtonBase = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  font-weight: bold;
  font-size: 16px;
  white-space: nowrap;
  cursor: pointer;
`;

export const OutlineButton = styled(ButtonBase)<{ outlineColor?: string }>`
  border: 2px solid ${({ outlineColor }) => outlineColor || 'white'};
  background-color: transparent;
  color: ${({ outlineColor }) => outlineColor || 'white'};
`;

export const FillButton = styled(ButtonBase)<{ fillColor?: string }>`
  border: none;
  background-color: ${({ fillColor }) => fillColor || 'white'};
  color: ${({ theme }) => theme.colors.darkGreen};
`;
