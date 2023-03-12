import styled from 'styled-components';

export const HomeContainer = styled.div`
  /* display: flex; */
  /* flex-direction: column; */
  /* align-items: center; */
  /* justify-content: center; */
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
  height: 100%;

  border-bottom: 1.5px solid ${({ theme }) => theme.colors.gray.b};
  box-sizing: content-box;
  margin-bottom: 1.5px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  scroll-snap-align: start;
`;
