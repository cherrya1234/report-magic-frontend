import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;

function App() {
  const [projectName, setProjectName] = useState('');
  const [email, setEmail] = useState('');
  const [files, setFiles] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [summary, setSummary] = useState(null);
  const [sessionId, setSessionId] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }
    formData.append('session_id', sessionId);
    formData.append('project_name', projectName);
    formData.append('email', email);
    formData.append('question', question);

    try {
      const res = await axios.post(`${API_BASE}/upload_full`, formData);
      setAnswer(res.data.answer);
      setSummary(res.data.files);
      setSessionId(res.data.session_id);
    } catch (err) {
      alert('Upload failed');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>📊 Report Magic</h1>
      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        /><br /><br />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br /><br />
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files))}
        /><br /><br />
        <textarea
          placeholder="Initial Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows="4"
          cols="50"
        /><br /><br />
        <button type="submit">Upload & Ask</button>
      </form>

      {summary && (
        <div>
          <h2>✅ Summary</h2>
          <pre>{JSON.stringify(summary, null, 2)}</pre>
        </div>
      )}
      {answer && (
        <div>
          <h2>💬 Answer</h2>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default App;