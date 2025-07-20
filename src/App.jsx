import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;

function App() {
  const [uploadData, setUploadData] = useState(null);
  const [sessionId, setSessionId] = useState(localStorage.getItem('session_id') || '');
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('session_id', sessionId);
    }
  }, [sessionId]);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const res = await axios.post(`${API_BASE}/api/upload`, formData);
    setUploadData(res.data.files);
    setSessionId(res.data.session_id);
  };

  const handleAsk = async () => {
    if (!question) return;
    const newMsgs = [...messages, { role: 'user', text: question }];
    setMessages(newMsgs);
    setQuestion('');

    const res = await axios.post(`${API_BASE}/api/ask`, {
      session_id: sessionId,
      question
    });

    setMessages([...newMsgs, { role: 'assistant', text: res.data.answer }]);
  };

  const downloadPDF = () => {
    window.open(`${API_BASE}/api/export`, '_blank');
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>📊 Report Magic</h1>
      <input type="file" multiple onChange={handleUpload} />
      {uploadData && <pre>{JSON.stringify(uploadData, null, 2)}</pre>}
      <hr />
      <div>
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question..."
        style={{ width: '70%', marginRight: 10 }}
      />
      <button onClick={handleAsk}>Ask</button>
      <br /><br />
      <button onClick={downloadPDF}>Download PDF</button>
    </div>
  );
}

export default App;
