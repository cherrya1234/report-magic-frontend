import React, { useState } from 'react';
import axios from 'axios';

const QAChat = ({ sessionId, projectName, email }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleAsk = async () => {
    if (!input.trim()) return;
    if (!sessionId || !projectName || !email) {
      alert('Please make sure project name, email, and session ID are set.');
      return;
    }

    const question = input.trim();
    setMessages([...messages, { role: 'user', content: question }]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${apiBaseUrl}/api/ask`, {
        session_id: sessionId,
        project_name: projectName,
        email,
        question,
      });

      const answer = response.data.answer || 'No response';
      setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
      setQuestionCount((count) => count + 1);
    } catch (error) {
      console.error('Ask failed:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: '❌ Error getting answer' }]);
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
      const response = await axios.get(`${apiBaseUrl}/api/export`, {
        params: {
          session_id: sessionId,
          project_name: projectName,
          email,
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${projectName || 'report'}-Q&A.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download failed:', error);
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
          {messages.map((msg, i) => (
            <li key={i} style={{ marginBottom: '10px' }}>
              <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QAChat;
