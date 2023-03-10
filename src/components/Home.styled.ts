import styled from 'styled-components';

export const HomeContainer = styled.div`
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
`;

export const InnerWrapper = styled.div`
  /* outline: 1px solid yellow; */

  position: relative;
  width: 100%;
  height: calc(100% - 1.5em);
  padding-top: 1.5em;

  border-bottom: 1.5px solid ${({ theme }) => theme.colors.gray.b};
  box-sizing: content-box;
  margin-bottom: 1.5px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  scroll-snap-align: start;

  > h2 {
    /* outline: 1px solid red; */

    height: 1.5em;
    position: absolute;
    top: 0;
  }
`;

export const DoubleContainer = styled.div`
  /* outline: 1px solid green; */

  width: 90%;
  height: 100%;
  display: flex;
  flex-direction: row;

  align-items: center;
  justify-content: space-evenly;

  > div {
    /* outline: 1px solid blue; */

    width: 50%;
    height: 65%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    > p {
      width: 80%;
    }
  }
`;
