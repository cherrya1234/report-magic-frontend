import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'https://report-magician-backend.onrender.com';

export default function UploadForm() {
  const [projectName, setProjectName] = useState('');
  const [files, setFiles] = useState([]);
  const [sessionId, setSessionId] = useState(localStorage.getItem('session_id') || '');
  const [uploads, setUploads] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (sessionId) localStorage.setItem('session_id', sessionId);
  }, [sessionId]);

  const onFileChange = (e) => {
    setFiles(Array.from(e.target.files || []));
    setUploads([]);
    setError('');
  };

  const uploadAll = async (e) => {
    e?.preventDefault?.();
    setError('');

    if (!projectName.trim()) {
      setError('Please enter a project name.');
      return;
    }
    if (!files.length) {
      setError('Please choose at least one file.');
      return;
    }

    setBusy(true);
    const results = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('project_name', projectName);
        if (sessionId) formData.append('session_id', sessionId);

        results.push({ name: file.name, status: 'uploading...' });
        setUploads([...results]);

        const res = await axios.post(`${API_BASE}/upload-to-s3`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (!sessionId && res.data?.session_id) {
          setSessionId(res.data.session_id);
        }

        results[results.length - 1] = {
          name: file.name,
          key: res.data?.key,
          status: 'uploaded',
          link: null,
        };
        setUploads([...results]);
      }
    } catch (err) {
      console.error(err);
      setError('One or more uploads failed.');
    } finally {
      setBusy(false);
    }
  };

  const getDownloadLink = async (key, index) => {
    try {
      const { data } = await axios.get(`${API_BASE}/presign-get`, {
        params: { key, expires_in: 3600 },
      });
      const next = uploads.slice();
      next[index] = { ...next[index], link: data?.url || null };
      setUploads(next);
      if (data?.url) window.open(data.url, '_blank');
    } catch (e) {
      console.error(e);
      alert('Failed to create download link.');
    }
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <h2>Upload Excel files to S3 (private)</h2>
      <form onSubmit={uploadAll} style={{ marginBottom: 12 }}>
        <div style={{ marginBottom: 8 }}>
          <label>Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter a project name"
            style={{ display: 'block', width: '100%', padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Excel Files (.xlsx / .xls)</label>
          <input type="file" accept=".xlsx,.xls" multiple onChange={onFileChange} />
        </div>

        <button type="submit" disabled={busy}>
          {busy ? 'Uploading...' : 'Upload to Report Magician'}
        </button>
      </form>

      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

      {uploads.length > 0 && (
        <div>
          <h4>Uploads</h4>
          <ul>
            {uploads.map((u, i) => (
              <li key={`${u.name}-${i}`} style={{ marginBottom: 6 }}>
                <div><strong>File:</strong> {u.name}</div>
                <div><strong>Status:</strong> {u.status}</div>
                {u.key && (
                  <div style={{ wordBreak: 'break-all' }}>
                    <strong>S3 Key:</strong> <code>{u.key}</code>
                  </div>
                )}
                {u.key && (
                  <button type="button" onClick={() => getDownloadLink(u.key, i)} style={{ marginTop: 6 }}>
                    Get download link (1 hour)
                  </button>
                )}
                {u.link && (
                  <div style={{ marginTop: 4, wordBreak: 'break-all' }}>
                    <strong>Link:</strong> <a href={u.link} target="_blank" rel="noreferrer">{u.link}</a>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}