import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = ({ sessionId, projectName, email, setUploadStatus }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleUpload = async () => {
    if (!sessionId || !projectName || !email || selectedFiles.length === 0) {
      alert('Please fill in all fields and select files.');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('session_id', sessionId);
    formData.append('project_name', projectName);
    formData.append('email', email);

    try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (response.status === 200) {
        setUploadStatus('✅ Upload successful.');
      } else {
        setUploadStatus('❌ Upload failed.');
      }
    } catch (error) {
      console.error(error);
      setUploadStatus('❌ Upload failed.');
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label>Excel Files (.xlsx / .xls)</label>
      <input type="file" accept=".xlsx,.xls" multiple onChange={handleFileChange} />
      <br />
      <button onClick={handleUpload}>Upload to Report Magician</button>
    </div>
  );
};

export default UploadForm;
