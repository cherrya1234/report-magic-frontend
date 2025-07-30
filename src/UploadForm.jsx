import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = ({ onUploadComplete, sessionId, setSessionId, projectName, setProjectName, email, setEmail }) => {
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!projectName || !email || files.length === 0) {
      alert('Please fill in all fields and select at least one file.');
      return;
    }

    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }
    formData.append('project_name', projectName);
    formData.append('email', email);
    if (sessionId) formData.append('session_id', sessionId);

    try {
      const response = await axios.post('https://report-magician-backend.onrender.com/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.session_id) {
        setSessionId(response.data.session_id);
      }

      setUploadStatus('✅ Upload successful.');
      onUploadComplete(response.data);
    } catch (error) {
      console.error(error);
      setUploadStatus('❌ Upload failed.');
    }
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2>🧙‍♂️ Report Magician</h2>
      <label>
        <strong>Project Name</strong><br />
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter a project name"
          style={{ width: '100%', marginBottom: '1rem' }}
        />
      </label>
      <br />
      <label>
        <strong>Your Email</strong><br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          style={{ width: '100%', marginBottom: '1rem' }}
        />
      </label>
      <br />
      <label>
        <strong>Excel Files (.xlsx / .xls)</strong><br />
        <input
          type="file"
          multiple
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          style={{ marginBottom: '1rem' }}
        />
      </label>
      <br />
      <button onClick={handleUpload}>Upload to Report Magician</button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};
