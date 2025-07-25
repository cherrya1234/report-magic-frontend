
import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [projectName, setProjectName] = useState('');
  const [email, setEmail] = useState('');
  const [files, setFiles] = useState([]);

  const handleUpload = async () => {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }
    formData.append('session_id', projectName + '_' + email);
    await axios.post('https://report-magic-backend.onrender.com/api/upload', formData);
    alert('Files uploaded successfully.');
  };

  return (
    <div>
      <label>Project Name</label><br />
      <input value={projectName} onChange={(e) => setProjectName(e.target.value)} /><br />
      <label>Your Email</label><br />
      <input value={email} onChange={(e) => setEmail(e.target.value)} /><br />
      <input type="file" multiple onChange={(e) => setFiles(e.target.files)} /><br />
      <button onClick={handleUpload}>Upload to Report Magic</button>
    </div>
  );
};

export default UploadForm;
