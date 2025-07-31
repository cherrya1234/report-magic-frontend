import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = ({ sessionId, setSessionId, email, setEmail, projectName, setProjectName }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleUpload = async () => {
    if (!file || !email || !projectName) {
      setStatus('Please fill in all fields and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('projectName', projectName);
    formData.append('email', email);
    formData.append('file', file);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSessionId(response.data.session_id);
      setStatus('✅ Upload successful!');
    } catch (error) {
      setStatus('❌ Upload failed.');
    }
  };

  return (
    <div>
      <h2>🧙‍♂️ Report Magician</h2>
      <label>Project Name</label>
      <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Enter a project name" />
      <br />
      <label>Your Email</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
      <br />
      <label>Excel Files (.xlsx / .xls)</label>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <br />
      <button onClick={handleUpload}>Upload to Report Magician</button>
      <p>{status}</p>
    </div>
  );
};

export default UploadForm;
