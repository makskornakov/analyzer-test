import styled from 'styled-components';

// width and height props
export const StyledUploader = styled.div<{
  width: string;
  height: string;
}>`
  outline: 1px solid red;
  color: ${({ theme }) => theme.colors.text};

  width: ${({ width }) => width};
  height: ${({ height }) => height};
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
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 1em;
  min-height: calc(100% - 2em);

  border: 4px dashed;
  border-color: ${({ theme }) => theme.colors.primary};
  background-color: transparent;
  transition: 0.4s;
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
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
`;
