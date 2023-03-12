import styled, { createGlobalStyle } from 'styled-components';
import themeMap from '@/theme';

export const GlobalStyles = createGlobalStyle`
  * {
    /* margin: 0; */
    /* padding: 0; */
    box-sizing: border-box;
  }

  body {

    margin: 0;
    font-family: -apple-system, 'roboto', sans-serif;

    background-color: ${({ theme }) => themeMap[theme as keyof typeof themeMap].colors.background};
    color: ${({ theme }) => themeMap[theme as keyof typeof themeMap].colors.text};

    transition: 0.4s;

    div {
      &.rightBorder {
        border-right: 0.75px solid ${({ theme }) =>
          themeMap[theme as keyof typeof themeMap].colors.text};
      }

      &.leftBorder {
        border-left: 0.75px solid ${({ theme }) =>
          themeMap[theme as keyof typeof themeMap].colors.text};
      }
    }
  }
  /* hide scroll bar */
  body::-webkit-scrollbar {
    display: none;
  }

  header{
   /* outline: 1px solid red; */

    width: 97%;
    height: 4.5em;
    display: flex;
    flex-direction: row;
    margin: 0 auto;
    padding: 0;
    justify-content: space-between;
    align-items: center;
    scroll-snap-align: start;
  }

  h1, h2, h3 {
    /* font family -  */
    font-family: 'Staatliches', cursive;
    text-align: center;
  }
`;

export const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 10px;
  border-radius: 5px;
  border: none;
  color: inherit;
  cursor: pointer;

  transition: 0.4s ease-in-out;
  transition-property: background-color;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;
