import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = ({ sessionId, setSessionId, setProjectName, setEmail }) => {
  const [project, setProject] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [files, setFiles] = useState([]); // allow selecting multiple files
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [uploads, setUploads] = useState([]); // list of {name, key}

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
  };

  const handleStartNewSession = () => {
    setSessionId(null);
    setUploads([]);
    setStatus('🔄 New session started. Please upload files.');
  };

  const uploadOne = async (file, currentSessionId) => {
    const form = new FormData();
    form.append('projectName', project);
    form.append('email', userEmail);
    form.append('file', file);
    if (currentSessionId) form.append('session_id', currentSessionId);

    const res = await axios.post(`${apiBaseUrl}/api/upload`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: false,
    });
    return res.data; // { session_id, s3_key }
  };

  const handleUpload = async () => {
    try {
      setError('');
      setStatus('Uploading...');
      if (!project || !userEmail || files.length === 0) {
        setError('Please fill in Project, Email, and select at least one file.');
        setStatus('');
        return;
      }

      // If we already have a sessionId, append files to it; else backend will create one on first file.
      let curSession = sessionId || null;
      const newUploads = [];

      for (const file of files) {
        const data = await uploadOne(file, curSession);
        // For the very first file, capture new session_id from backend
        if (!curSession) {
          curSession = data.session_id;
          setSessionId(curSession);
        }
        newUploads.push({ name: file.name, key: data.s3_key });
      }

      setUploads((prev) => [...prev, ...newUploads]);
      setProjectName(project);
      setEmail(userEmail);
      setStatus('✅ Upload successful!');
      setFiles([]);
    } catch (e) {
      console.error(e);
      setError('❌ Upload failed.');
      setStatus('');
    }
  };

  return (
    <div style={{ marginTop: 10 }}>
      <h2>🧙‍♂️ Report Magician</h2>

      <label>
        <strong>Project Name</strong><br />
        <input
          type="text"
          placeholder="Enter a project name"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          style={{ width: '100%' }}
        />
      </label>

      <br /><br />

      <label>
        <strong>Your Email</strong><br />
        <input
          type="email"
          placeholder="Enter your email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          style={{ width: '100%' }}
        />
      </label>

      <br /><br />

      <label>
        <strong>Excel Files (.xlsx / .xls)</strong><br />
        <input
          type="file"
          accept=".xlsx,.xls"
          multiple
          onChange={handleSelect}
        />
      </label>

      <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
        <button onClick={handleUpload}>Upload {files.length > 0 ? `(${files.length})` : ''}</button>
        <button type="button" onClick={handleStartNewSession}>Start New Session</button>
      </div>

      {status && <p style={{ color: 'green' }}>{status}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginTop: 10 }}>
        <p><strong>Session:</strong> {sessionId || 'No session yet'}</p>
        {uploads.length > 0 && (
          <>
            <p><strong>Uploaded files in this session:</strong></p>
            <ul>
              {uploads.map((u, i) => (
                <li key={`${u.key}-${i}`}>{u.name}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadForm;
src/App.jsx (wire session + pass to QA)
jsx
Copy
import React, { useState } from 'react';
import UploadForm from './UploadForm.jsx';
import QAChat from './QAChat.jsx';

const App = () => {
  const [sessionId, setSessionId] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>🧙‍♂️ Report Magician</h1>

      <UploadForm
        sessionId={sessionId}
        setSessionId={setSessionId}
        setProjectName={setProjectName}
        setEmail={setEmail}
      />

      <QAChat
        sessionId={sessionId}
        projectName={projectName}
        email={email}
      />
    </div>
  );
};

export default App;


