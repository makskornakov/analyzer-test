import { useRef, useState } from 'react';
import {
  StyledUploader,
  UploadInput,
  ImageUploadWrap,
  FileUploadContent,
  RemoveButton,
  UploadSectionWrapper,
  PreviewWrapper,
} from './Uploader.styled';

import themeMap from '@/theme';
interface UploadedFile {
  data: Object[];
}

export function Upload({
  theme,
  json,
  setJson,
}: {
  theme: keyof typeof themeMap;
  json: UploadedFile | null;
  setJson: (newJson: UploadedFile | null) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  // const [json, setJson] = useState<UploadedFile | null>(null);

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
      imageWrapDiv.current.style.borderColor = themeMap[theme].colors.gray.b;
      imageWrapDiv.current.style.backgroundColor = 'rgba(156, 156, 156, 0.2)';
    }
  }

  function handleDragLeave() {
    if (imageWrapDiv.current) {
      imageWrapDiv.current.style.borderColor = themeMap[theme].colors.primary;
      imageWrapDiv.current.style.backgroundColor = 'transparent';
    }
  }

  return (
    <UploadSectionWrapper>
      <StyledUploader width={'50%'} height={'20em'} className="rightBorder">
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
        {file && (
          <FileUploadContent>
            {json && json.data.length > 0 && (
              <>
                <div
                  style={{
                    textAlign: 'center',
                  }}
                >
                  <h3>{file.name}</h3>
                  <h4>Length: {json.data.length}</h4>
                </div>
              </>
            )}
            <div>
              <RemoveButton type="button" onClick={handleRemove}>
                Remove <span>File</span>
              </RemoveButton>
            </div>
          </FileUploadContent>
        )}
      </StyledUploader>
      <PreviewWrapper className="leftBorder" width={'50%'} height={'20em'}>
        {json && <pre>{JSON.stringify(json, null, 2)}</pre>}
      </PreviewWrapper>
    </UploadSectionWrapper>
  );
}
