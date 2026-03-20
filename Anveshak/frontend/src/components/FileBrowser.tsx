import React, { useRef, useState } from 'react';

const FileBrowser = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  };

  const fileListStyle: React.CSSProperties = {
    listStyleType: 'none',
    padding: '0',
    marginTop: '20px',
    color: '#ccc',
  };

  const fileListItemStyle: React.CSSProperties = {
    backgroundColor: '#333',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '5px',
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#1e1e1e', borderRadius: '10px' }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        multiple
      />
      <button onClick={handleBrowseClick} style={buttonStyle} aria-label="Browse files to upload">
        Browse Files
      </button>
      {selectedFiles.length > 0 && (
        <div>
          <h3 style={{ color: 'white' }}>Selected Files:</h3>
          <ul style={fileListStyle}>
            {selectedFiles.map((file, index) => (
              <li key={index} style={fileListItemStyle}>
                {file.name} - {(file.size / 1024).toFixed(2)} KB
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileBrowser;
