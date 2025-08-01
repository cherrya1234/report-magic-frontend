import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = ({ setSessionId, setProjectName, setEmail }) => {
  const [projectName, updateProjectName] = useState('');
  const [email, updateEmail] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleUpload = async () => {
    if (!projectName || !email || !file) {
      setError('Please fill in all fields and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('projectName', projectName);
    formData.append('email', email);
    formData.append('file', file); // fixed

    try {
      const response = await axios.post(`${apiBaseUrl}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { session_id } = response.data;
      setSessionId(session_id);
      setProjectName(projectName);
      setEmail(email);
      setUploadStatus('✅ Upload successful!');
      setError('');
    } catch (err) {
      console.error(err);
      setError('❌ Upload failed.');
      setUploadStatus('');
    }
  };

  return (
    <div>
      <label>
        <strong>Project Name</strong><br />
        <input type="text" value={projectName} onChange={(e) => updateProjectName(e.target.value)} />
      </label>
      <br /><br />
      <label>
        <strong>Your Email</strong><br />
        <input type="email" value={email} onChange={(e) => updateEmail(e.target.value)} />
      </label>
      <br /><br />
      <label>
        <strong>Excel Files (.xlsx / .xls)</strong><br />
        <input type="file" accept=".xlsx,.xls" onChange={(e) => setFile(e.target.files[0])} />
      </label>
      <br /><br />
      <button onClick={handleUpload}>Upload to Report Magician</button>
      <br />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {uploadStatus && <p style={{ color: 'green' }}>{uploadStatus}</p>}
    </div>
  );
};

export default UploadForm;

