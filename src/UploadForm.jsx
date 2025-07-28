import React, { useState } from 'react';
import axios from 'axios';

function UploadForm({ setSessionId, setMessage }) {
  const [projectName, setProjectName] = useState('');
  const [email, setEmail] = useState('');
  const [files, setFiles] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files || files.length === 0) {
      alert('Please select at least one Excel file to upload.');
      return;
    }

    const formData = new FormData();
    for (let file of files) {
      formData.append('files', file);
    }

    if (projectName) formData.append('projectName', projectName);
    if (email) formData.append('email', email);

    try {
      const response = await axios.post(
        'https://report-magician-backend.onrender.com/api/upload',
        formData
      );

      setSessionId(response.data.session_id);
      setMessage('✅ Upload successful. You can now ask questions.');
    } catch (error) {
      console.error('Upload failed:', error);
      setMessage('❌ Upload failed. Please try again.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <div>
          <label>Project Name</label><br />
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter a project name"
          />
        </div>
        <div>
          <label>Your Email</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div>
          <input
            type="file"
            accept=".xls,.xlsx"
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />
        </div>
        <button type="submit">Upload to Report Magician</button>
      </form>
    </div>
  );
}

export default UploadForm;
