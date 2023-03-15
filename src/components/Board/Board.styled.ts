import styled from 'styled-components';

export const BoardContainer = styled.div`
  outline: 1px solid red;

  display: flex;
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

export const Item = styled.div`
  outline: 1px solid green;
  /* box-sizing: content-box; */
  width: 90%;
  height: 3em;
  background-color: #f5f5f5;
  color: #000;
  border-radius: 0.5em;
  margin-top: 1.5em;
`;
