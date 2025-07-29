import React, { useState } from 'react';
import axios from 'axios';

const QAChat = ({ sessionId, projectName, email }) => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [count, setCount] = useState(0);

  const askQuestion = async () => {
    if (!sessionId) {
      alert('No session detected. Upload files first.');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/ask`, {
        session_id: sessionId,
        prompt: question,
        project_name: projectName,
        email,
      });

      setMessages([...messages, { user: question, ai: response.data.answer }]);
      setQuestion('');
      setCount(count + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const downloadPDF = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/export`, {
        params: {
          session_id: sessionId,
          email,
          project_name: projectName
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${projectName || 'report'}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setCount(0);
  };

  return (
    <div>
      <h3>💬 Q&A</h3>
      <p>Questions asked: {count}</p>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask something about your uploaded data..."
      />
      <button onClick={askQuestion}>Ask</button>
      <button onClick={clearMessages}>Clear Q&A</button>
      <button onClick={downloadPDF}>Download PDF</button>

      <div>
        {messages.length === 0 && <p>No messages yet.</p>}
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginTop: '10px' }}>
            <b>You:</b> {msg.user}<br />
            <b>AI:</b> {msg.ai}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QAChat;
