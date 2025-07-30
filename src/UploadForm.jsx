import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [projectName, setProjectName] = useState('');
  const [email, setEmail] = useState('');
  const [files, setFiles] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [sessionId, setSessionId] = useState('');

  const handleUpload = async () => {
    if (!projectName || !email || !files) {
      setUploadStatus('Please complete all fields and select files.');
      return;
    }

    const formData = new FormData();
    formData.append('project_name', projectName);
    formData.append('email', email);
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const res = await axios.post('https://report-magician-backend.onrender.com/api/upload', formData);
      setUploadStatus('✅ Upload successful!');
      setSessionId(res.data.session_id);
      sessionStorage.setItem('session_id', res.data.session_id);
      sessionStorage.setItem('project_name', projectName);
      sessionStorage.setItem('email', email);
    } catch (err) {
      setUploadStatus('❌ Upload failed.');
      console.error(err);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label>Project Name<br />
        <input value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Enter a project name" />
      </label><br />
      <label>Your Email<br />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" />
      </label><br />
      <label>Excel Files (.xlsx / .xls)
        <input type="file" accept=".xlsx,.xls" multiple onChange={e => setFiles(e.target.files)} />
      </label><br />
      <button onClick={handleUpload}>Upload to Report Magician</button>
      <div>{uploadStatus}</div>
    </div>
  );
};

export default UploadForm;
