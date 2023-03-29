import styled from 'styled-components';

export const BoardListContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
  height: 100%;
`;

export const LiContainer = styled.ul`
  box-sizing: content-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  user-select: none;
  -webkit-user-select: none;

  li {
    cursor: grab;
  }
`;
