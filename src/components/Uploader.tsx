import { useRef, useState } from 'react';
import {
  StyledUploader,
  UploadInput,
  ImageUploadWrap,
  FileUploadContent,
  RemoveButton,
} from './uploader.styled';
interface UploadedFile {
  data: Object[];
}

export function Upload({
  wrapWidth,
  wrapHeight,
}: {
  wrapWidth?: string;
  wrapHeight?: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [json, setJson] = useState<UploadedFile | null>(null);

  const input = useRef<HTMLInputElement>(null);
  const imageWrapDiv = useRef<HTMLDivElement>(null);

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

  function handleDragEnter() {
    if (imageWrapDiv.current) {
      imageWrapDiv.current.style.borderColor = 'white';
      imageWrapDiv.current.style.backgroundColor = '#1fb264';
    }
  }

  function handleDragLeave() {
    if (imageWrapDiv.current) {
      imageWrapDiv.current.style.borderColor = '#1fb264';
      imageWrapDiv.current.style.backgroundColor = 'transparent';
    }
  }

  return (
    <>
      <StyledUploader width={wrapWidth || '40%'} height={wrapHeight || '15em'}>
        {file === null && (
          <ImageUploadWrap ref={imageWrapDiv}>
            <UploadInput
              type="file"
              onChange={handleFile}
              ref={input}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onMouseEnter={handleDragEnter}
              onMouseLeave={handleDragLeave}
            />
            <div>
              <h3>Drag and drop or Click to upload your Data</h3>
            </div>
          </ImageUploadWrap>
        )}
        {file && json && (
          <>
            <p>{file.name}</p>
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
      {json && (
        <>
          <pre>{JSON.stringify(json, null, 2)}</pre>
        </>
      )}
    </>
  );
}