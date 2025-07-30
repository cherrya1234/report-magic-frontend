import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = ({ onUploadSuccess, sessionId, setProjectName, setEmail }) => {
  const [project, setProject] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadedKey, setUploadedKey] = useState('');

  const handleUpload = async () => {
    if (!project || !emailInput || !file) {
      alert('Please fill in all fields and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('project_name', project);
    formData.append('email', emailInput);
    formData.append('session_id', sessionId);

    try {
      setUploadStatus('Uploading...');
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/upload`,
        formData
      );

      setUploadStatus('✅ Upload successful');
      setUploadedKey(response.data.s3_key);

      // Optional state lifting
      setProjectName(project);
      setEmail(emailInput);
      if (onUploadSuccess) onUploadSuccess(response.data);
    } catch (error) {
      console.error(error);
      setUploadStatus('❌ Upload failed.');
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div>
        <label>Project Name</label><br />
        <input
          type="text"
          placeholder="Enter a project name"
          value={project}
          onChange={(e) => setProject(e.target.value)}
        /><br /><br />
        <label>Your Email</label><br />
        <input
          type="email"
          placeholder="Enter your email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
        /><br /><br />
        <label>Excel Files (.xlsx / .xls)</label><br />
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files[0])}
        /><br /><br />
        <button onClick={handleUpload}>Upload to Report Magician</button>
        <p>{uploadStatus}</p>
        {uploadedKey && (
          <p>
            S3 Key: <code>{uploadedKey}</code>
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadForm;
