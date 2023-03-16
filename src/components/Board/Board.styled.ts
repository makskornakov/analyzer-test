import styled, { css } from 'styled-components';

export const BoardContainer = styled.div`
  outline: 1px solid red;

  display: flex;
  position: relative;
  user-select: none;
  width: 70%;
  height: 75%;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: row;

  > div {
    outline: 1px solid blue;

    display: flex;
    flex-direction: column;
    width: 30%;
    height: 70%;
  }
`;

const mainItemStyle = css`
  /* outline: 1px solid green; */
  width: 15em;
  height: 3em;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;

  border-radius: 0.5em;
`;
export const ItemStyled = styled.div`
  background-color: #f5f5f5;

  &:not(.react-draggable-dragging) {
    transition-property: transform;
    transition-duration: 0.5s;
  }

  ${mainItemStyle}
`;

export const ItemPlaceholderStyled = styled.div`
  ${mainItemStyle}
  background-color: rgba(255, 255, 255, 0.5);
  opacity: 0.5;
`;
