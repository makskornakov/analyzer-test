import styled, { css } from 'styled-components';

export const NewBoardListContainer = styled.div<{ active: boolean }>`
  background-color: rgb(235, 236, 240);
  border-radius: 10px;
  min-width: 300px;

  padding: 10px;

  display: flex;
  flex-direction: column;
  row-gap: 10px;

  ${({ active }) =>
    active &&
    css`
      background-color: red;
    `}
`;
