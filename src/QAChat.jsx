import React, { useState } from 'react';
import axios from 'axios';

const QAChat = ({ sessionId, projectName, email }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleAsk = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (!sessionId) {
      alert('No session detected. Upload files first.');
      return;
    }
    setMessages(prev => [...prev, { role: 'user', content: trimmed }]);
    setInput('');
    setLoading(true);
    try {
      const res = await axios.post(`${apiBaseUrl}/api/ask`, {
        session_id: sessionId,
        prompt: trimmed,
      }, { withCredentials: false });
      const answer = res?.data?.answer ?? 'No answer';
      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
      setQuestionCount(c => c + 1);
    } catch (err) {
      const msg = err?.response?.data?.detail || '❌ Error getting answer';
      console.error('Ask failed:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: msg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setQuestionCount(0);
  };

  const handleDownloadPDF = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/export`, {
        params: { session_id: sessionId, project_name: projectName, email },
        responseType: 'blob',
        withCredentials: false,
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName || 'report'}-Q&A.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error('Download failed:', e);
      alert('❌ Failed to download PDF');
    }
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>💬 Q&A</h2>
      <p><strong>Questions asked:</strong> {questionCount}</p>
      <p><strong>Session:</strong> {sessionId || 'No session detected'}</p>

      <textarea
        rows={3}
        placeholder="Ask something about your uploaded data..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: '100%', marginBottom: '10px' }}
      />

      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <button onClick={handleAsk} disabled={loading || !input}>
          {loading ? 'Asking...' : 'Ask'}
        </button>
        <button onClick={handleClear}>Clear Q&A</button>
        <button onClick={handleDownloadPDF}>Download PDF</button>
      </div>

      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {messages.map((m, i) => (
            <li key={i} style={{ marginBottom: '10px' }}>
              <strong>{m.role === 'user' ? 'You' : 'AI'}:</strong> {m.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QAChat;