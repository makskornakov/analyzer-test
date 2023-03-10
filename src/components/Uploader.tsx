import { useState } from 'react';

// upload json file and return json object vizualization
interface UploadedFile {
  data: Object[];
}

export function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [json, setJson] = useState<UploadedFile | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
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

  return (
    <div>
      <input type="file" onChange={handleFile} />
      {file && <p>{file.name}</p>}
      {json && (
        <>
          <pre>{JSON.stringify(json, null, 2)}</pre>
          <pre>Length: {json.data.length}</pre>
        </>
      )}
    </div>
  );
}
