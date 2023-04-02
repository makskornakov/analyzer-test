import styled, { css, CSSObject } from 'styled-components';

export const BoardListContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
  height: 80%;
`;

export const LiContainer = styled.ul<{ listStyle?: CSSObject; listActiveStyle?: CSSObject }>`
  box-sizing: content-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  user-select: none;
  -webkit-user-select: none;

  ${({ listStyle, listActiveStyle }) => {
    return css`
      ${listStyle};

      &.active {
        ${listActiveStyle}
      }
    `;
  }}
`;

export const ListItem = styled.li<{ itemStyle?: CSSObject; itemActiveStyle?: CSSObject }>`
  ${({ itemStyle, itemActiveStyle }) => {
    return css`
      cursor: grab;

      ${itemStyle};

      &.react-draggable-dragging {
        cursor: grabbing;
        ${itemActiveStyle}
      }
    `;
  }}
`;
