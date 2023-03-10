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
  width: 100%;

  /* height: calc(100% - 3.5em); */
  height: 100%;
  /* padding-top: 3.5em; */

  border-bottom: 1px solid ${({ theme }) => theme.colors.gray.b};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  scroll-snap-align: start;
  position: relative;
`;
