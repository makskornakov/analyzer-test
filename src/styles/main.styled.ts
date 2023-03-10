import styled, { createGlobalStyle } from 'styled-components';
import themeMap from '@/theme';

export const GlobalStyles = createGlobalStyle`
  * {
    /* margin: 0; */
    /* padding: 0; */
    box-sizing: border-box;
  }

  body {
    font-family: 'arial', sans-serif;
    background-color: ${({ theme }) =>
      themeMap[theme as keyof typeof themeMap].colors.background};
    color: ${({ theme }) =>
      themeMap[theme as keyof typeof themeMap].colors.text};

    transition: 0.4s;
  }

  h1, h2, h3 {
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
