import { useEffect, useRef, useState } from 'react';
import {
  StyledUploader,
  // StyledUploaderButton,
  UploadInput,
  ImageUploadWrap,
  FileUploadContent,
  RemoveButton,
} from './uploader.styled';
interface UploadedFile {
  data: Object[];
}

export function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [json, setJson] = useState<UploadedFile | null>(null);

  const input = useRef<HTMLInputElement>(null);

  const handleJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target) {
          const json = JSON.parse(e.target.result as string);
          setJson(json);
        }
      };

      reader.readAsText(e.target.files[0]);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      handleJson(e);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setJson(null);
    if (input.current) {
      input.current.value = '';
    }
  };

  const imageWrapDiv = useRef<HTMLDivElement>(null);

  // hang listener on input when onDragEnter and onDragLeave change imageWrapDiv
  // useEffect(() => {
  //   if (input.current) {
  //     input.current.addEventListener('dragenter', () => {
  //       if (imageWrapDiv.current) {
  //         imageWrapDiv.current.style.borderColor = 'white';
  //       }
  //     });
  //     input.current.addEventListener('dragleave', () => {
  //       if (imageWrapDiv.current) {
  //         imageWrapDiv.current.style.borderColor = '#1fb264';
  //       }
  //     });
  //   }
  // }, []);

  return (
    // <div>
    //   <StyledUploaderInput type="file" onChange={handleFile} />
    //   {file && <p>{file.name}</p>}
    //   {json && (
    //     <>
    //       <pre>{JSON.stringify(json, null, 2)}</pre>
    //       <pre>Length: {json.data.length}</pre>
    //     </>
    //   )}
    // </div>

    <StyledUploader>
      {/* <StyledUploaderButton
        type="button"
        // onclick="$('.file-upload-input').trigger( 'click' )"
      >
        Add Image
      </StyledUploaderButton> */}

      {file === null && (
        <ImageUploadWrap ref={imageWrapDiv}>
          <UploadInput
            type="file"
            onChange={handleFile}
            ref={input}
            onDragEnter={() => {
              if (imageWrapDiv.current) {
                imageWrapDiv.current.style.borderColor = 'white';
                imageWrapDiv.current.style.backgroundColor = '#1fb264';
              }
            }}
            onDragLeave={() => {
              if (imageWrapDiv.current) {
                imageWrapDiv.current.style.borderColor = '#1fb264';
                imageWrapDiv.current.style.backgroundColor = 'transparent';
              }
            }}
            onMouseEnter={() => {
              if (imageWrapDiv.current) {
                imageWrapDiv.current.style.borderColor = 'white';
                imageWrapDiv.current.style.backgroundColor = '#1fb264';
              }
            }}
            onMouseLeave={() => {
              if (imageWrapDiv.current) {
                imageWrapDiv.current.style.borderColor = '#1fb264';
                imageWrapDiv.current.style.backgroundColor = 'transparent';
              }
            }}
          />
          <div>
            <h3>Drag and drop a file or select add Image</h3>
          </div>
        </ImageUploadWrap>
      )}
      {file && <p>{file.name}</p>}
      {json && (
        <>
          <pre>{JSON.stringify(json, null, 2)}</pre>
          <pre>Length: {json.data.length}</pre>
        </>
      )}
      {file && (
        <FileUploadContent>
          <div>
            <RemoveButton type="button" onClick={handleRemove}>
              Remove <span>File</span>
            </RemoveButton>
          </div>
        </FileUploadContent>
      )}
    </StyledUploader>
  );
}
