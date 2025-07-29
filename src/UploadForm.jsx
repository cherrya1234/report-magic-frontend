import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = ({ setSessionId, projectName, setProjectName, email, setEmail }) => {
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploads, setUploads] = useState([]);

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('project_name', projectName);
    formData.append('email', email);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData);
      setSessionId(response.data.session_id);
      setUploadStatus('Upload successful!');
      setUploads(response.data.uploads || []);
    } catch (error) {
      setUploadStatus('Upload failed.');
      console.error(error);
    }
  };

  return (
    <div>
      <label>Project Name</label>
      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        placeholder="Enter a project name"
      />
      <br />
      <label>Your Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <br />
      <input
        type="file"
        accept=".xlsx,.xls"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files))}
      />
      <button onClick={handleUpload}>Upload to Report Magician</button>
      {uploadStatus && <p>{uploadStatus}</p>}
      {uploads.length > 0 && (
        <div>
          <h4>Uploads</h4>
          {uploads.map((item, idx) => (
            <div key={idx}>
              <p>File: {item.filename}</p>
              <p>Status: {item.status}</p>
              <p>S3 Key: {item.s3_key}</p>
              {item.download_url && (
                <a href={item.download_url} target="_blank" rel="noreferrer">Get download link (1 hour)</a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadForm;
