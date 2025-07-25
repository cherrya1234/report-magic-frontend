import React, { useState } from 'react';
import axios from 'axios';

function UploadForm() {
  const [projectName, setProjectName] = useState('');
  const [email, setEmail] = useState('');
  const [files, setFiles] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files) {
      alert('Please select at least one file.');
      return;
    }

    const formData = new FormData();
    for (let file of files) {
      formData.append('files', file);
    }
    formData.append('session_id', projectName || email || 'default-session');

    setUploading(true);
    setMessage('Uploading...');

    try {
      const response = await axios.post(
        'https://report-magic-backend.onrender.com/api/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      setMessage('✅ Files uploaded successfully!');
      console.log('Upload response:', response.data);
    } catch (error) {
      setMessage('❌ Upload failed. Check console for details.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Project Name</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="My Report"
        />
      </div>

      <div>
        <label>Your Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>

      <div>
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
        />
      </div>

      <button type="submit" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload to Report Magic'}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}

export default UploadForm;
