import styled from 'styled-components';

export const StyledUploader = styled.div`
  /* outline: 1px solid red; */
  background-color: #ffffff;
  width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

// export const StyledUploaderButton = styled.button`
//   width: 100%;
//   margin: 0;
//   color: #fff;
//   background: #1fb264;
//   border: none;
//   padding: 10px;
//   border-radius: 4px;
//   border-bottom: 4px solid #15824b;
//   transition: all 0.2s ease;
//   outline: none;
//   text-transform: uppercase;
//   font-weight: 700;
// `;

// hoverState (boolean) as prop

export const ImageUploadWrap = styled.div`
  margin-top: 20px;

  position: relative;
  border: 4px dashed;
  border-color: #1fb264;
  transition-duration: 0.4s;
  transition-property: border-color;
  transition: 0.4s;
  background-color: transparent;
  /* border outside the box */

  /* &:hover {
    border-color: white;
    background-color: #1fb264;
  } */
`;

export const UploadInput = styled.input`
  position: absolute;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;

  opacity: 0;
  cursor: pointer;
`;

export const RemoveButton = styled.button`
  width: 200px;
  margin: 0;
  color: #fff;
  background: #cd4535;
  border: none;
  padding: 10px;
  border-radius: 4px;
  border-bottom: 4px solid #b02818;
  transition: all 0.2s ease;
  outline: none;
  text-transform: uppercase;
  font-weight: 700;

  transition-duration: 0.4s;
  transition-property: background-color;
  &:hover {
    background: #b02818;
  }
`;
export const FileUploadContent = styled.div`
  /* display: none; */
  /* width: 100%; */
  /* height: 100px; */
  /* text-align: center; */
`;

// export const StyledUploaderInput = styled.input`
//   /* outline: 1px solid green; */
//   /* nice styled upload input */
//   height: 0.1px;
//   width: 0.1px;
//   opacity: 0;
//   overflow: hidden;
//   position: absolute;
//   z-index: -1;

//   &:focus + label {
//     outline: 1px dotted #000;
//     outline: -webkit-focus-ring-color auto 5px;
//   }
// `;
