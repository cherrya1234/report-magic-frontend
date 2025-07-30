
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QAChat = () => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [email, setEmail] = useState('');
  const [questionCount, setQuestionCount] = useState(0);

  const handleAsk = async () => {
    if (!sessionId) {
      alert('No session detected. Upload files first.');
      return;
    }
    const payload = {
      question,
      session_id: sessionId,
      project_name: projectName,
      email,
    };
    const res = await axios.post('https://report-magician-backend.onrender.com/api/ask', payload);
    setMessages([...messages, { role: 'user', content: question }, { role: 'assistant', content: res.data.answer }]);
    setQuestion('');
    setQuestionCount((prev) => prev + 1);
  };

  const clearQA = () => {
    setMessages([]);
    setQuestionCount(0);
  };

  const downloadPDF = async () => {
    const res = await axios.get('https://report-magician-backend.onrender.com/api/export', {
      params: { session_id: sessionId },
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'report.pdf');
    document.body.appendChild(link);
    link.click();
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setSessionId(urlParams.get('session_id') || '');
    setProjectName(urlParams.get('project_name') || '');
    setEmail(urlParams.get('email') || '');
  }, []);

  return (
    <div>
      <h2>💬 Q&A</h2>
      <p><strong>Questions asked:</strong> {questionCount}</p>
      <textarea
        placeholder="Ask something about your uploaded data..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <br />
      <button onClick={handleAsk}>Ask</button>
      <button onClick={clearQA}>Clear Q&A</button>
      <button onClick={downloadPDF}>Download PDF</button>
      <div>
        {messages.map((m, i) => (
          <p key={i}><strong>{m.role}:</strong> {m.content}</p>
        ))}
      </div>
    </div>
  );
};

export default QAChat;
