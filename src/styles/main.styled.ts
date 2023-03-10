import styled from 'styled-components';

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
