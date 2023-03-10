import styled from 'styled-components';

export const CheckBoxWrapper = styled.div`
  /* outline: 1px solid red; */

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1.25em;
`;

export const SunOrMoonWrapper = styled.div`
  width: 1.9em;
  height: 1.9em;
  position: relative;
  img {
    position: absolute;
    width: 100%;
    transition: 0.4s;
  }
`;
