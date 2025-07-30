
import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [projectName, setProjectName] = useState('');
  const [email, setEmail] = useState('');
  const [files, setFiles] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [s3Key, setS3Key] = useState('');

  const handleUpload = async () => {
    if (!files || !projectName || !email) {
      setUploadStatus('Please fill all fields and select files.');
      return;
    }

    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }
    formData.append('project_name', projectName);
    formData.append('email', email);

    try {
      const res = await axios.post('https://report-magician-backend.onrender.com/api/upload', formData);
      setUploadStatus('✅ Upload successful.');
      setS3Key(Object.values(res.data)[0].s3_key || '');
    } catch (err) {
      setUploadStatus('❌ Upload failed.');
    }
  };

  return (
    <div>
      <h2>Upload Excel files to S3 (private)</h2>
      <label>
        Project Name<br />
        <input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Enter a project name" />
      </label>
      <br /><br />
      <label>
        Your Email<br />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
      </label>
      <br /><br />
      <label>
        Excel Files (.xlsx / .xls)
        <input type="file" multiple accept=".xlsx,.xls" onChange={(e) => setFiles(e.target.files)} />
      </label>
      <br /><br />
      <button onClick={handleUpload}>Upload to Report Magician</button>
      <p>{uploadStatus}</p>
      {s3Key && <p><strong>S3 Key:</strong> {s3Key}</p>}
    </div>
  );
};

export default UploadForm;
