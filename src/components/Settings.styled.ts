import styled, { css } from 'styled-components';

export const ulStyles = css`
  list-style: none;
  padding: 0 0.5em;
  user-select: none;

  li {
    margin: 1em 0.25em;
    padding: 0.25em;
    font-size: 0.9em;
    overflow: hidden;
    border: 1px solid ${(props) => props.theme.colors.gray.b};
    border-radius: 0.25em;

    cursor: pointer;
    transition-duration: 0.4s;
    transition-property: background-color, color;

    &:hover {
      background-color: #eee;
      color: #000;
    }
  }
`;

export const CustomUl = styled.ul`
  ${ulStyles}
`;

export const FuncUL = styled.ul`
  ${ulStyles}
  outline: 1px solid ${(props) => props.theme.colors.gray.b};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  li {
    padding: 0.5em 2em;
  }
`;
