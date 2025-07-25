import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [projectName, setProjectName] = useState('');
  const [email, setEmail] = useState('');
  const [files, setFiles] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sessionId, setSessionId] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('session_id', sessionId);

    try {
      const res = await axios.post('https://report-magic-backend.onrender.com/api/upload', formData);
      setSessionId(res.data.session_id);
      alert('Upload successful');
    } catch (err) {
      alert('Upload failed');
    }
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://report-magic-backend.onrender.com/api/ask', {
        question,
        session_id: sessionId
      });
      setAnswer(res.data.answer);
    } catch (err) {
      setAnswer('Error asking question');
    }
  };

  const handleDownload = () => {
    window.open('https://report-magic-backend.onrender.com/api/export', '_blank');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Report Magic</h1>
      <form onSubmit={handleUpload}>
        <input placeholder="Project Name" value={projectName} onChange={e => setProjectName(e.target.value)} required />
        <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="file" multiple onChange={e => setFiles([...e.target.files])} required />
        <button type="submit">Upload Excel Files</button>
      </form>

      <form onSubmit={handleAsk} style={{ marginTop: '1rem' }}>
        <input placeholder="Ask a question" value={question} onChange={e => setQuestion(e.target.value)} />
        <button type="submit">Ask</button>
      </form>

      {answer && (
        <div style={{ marginTop: '1rem' }}>
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}

      <button onClick={handleDownload} style={{ marginTop: '1rem' }}>
        Download PDF
      </button>
    </div>
  );
}

export default App;
