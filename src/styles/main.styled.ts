import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    /* margin: 0; */
    /* padding: 0; */
    box-sizing: border-box;
  }

  body {
    font-family: 'arial', sans-serif;
    background-color: #f2f2f2;
  }

  h1, h2, h3 {
    text-align: center;
  }
`;

export const Button = styled.button`
  background-color: #000;
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;

  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #fff;
    color: #000;
    border: 1px solid #000;
  }
`;
