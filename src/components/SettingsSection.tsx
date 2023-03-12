import { useEffect, useState } from 'react';
import { DoubleContainer } from './Home.styled';
import { PreviewWrapper } from './Uploader.styled';

interface UploadedFile {
  data: Object[];
}

interface DataInfo {
  length: number;
  keys: string[];
  levels: number;
}

export default function SettingsSection({
  json,
  scrollFunction,
}: {
  json: UploadedFile | null;
  scrollFunction: () => void;
}) {
  const [dataInfo, setDataInfo] = useState<DataInfo | null>(null);

  const apiFunction = async (file: UploadedFile) => {
    const response = await fetch('http://localhost:3000/api/', {
      method: 'POST',
      body: JSON.stringify(file),
    });
    const data = await response.json();
    console.log(data);
    setDataInfo(data.dataInfo as DataInfo);
  };

  useEffect(() => {
    if (json) {
      apiFunction(json);
      scrollFunction();
    }
  }, [json, scrollFunction]);

  return (
    <DoubleContainer>
      <div className="rightBorder">
        {json ? (
          <>
            <h2>Preview</h2>
            <PreviewWrapper width="100%" height="80%">
              <pre>{JSON.stringify(json, null, 2)}</pre>
            </PreviewWrapper>
          </>
        ) : (
          <div>
            <h2>No JSON file uploaded</h2>
          </div>
        )}
      </div>
      <div className="leftBorder">
        {dataInfo ? (
          <>
            <h2>File info</h2>
            <p>Length: {dataInfo.length}</p>
            <p>Levels: {dataInfo.levels}</p>
            <p>Keys: {dataInfo.keys.join(', ')}</p>
          </>
        ) : (
          <div>
            <h2>No JSON file uploaded</h2>
          </div>
        )}
      </div>
    </DoubleContainer>
  );
}
