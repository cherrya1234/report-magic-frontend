import React, { useState } from 'react';
import axios from 'axios';

const QAChat = () => {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [questionCount, setQuestionCount] = useState(0);

  const sessionId = sessionStorage.getItem('session_id');
  const projectName = sessionStorage.getItem('project_name');
  const email = sessionStorage.getItem('email');

  const askQuestion = async () => {
    if (!question.trim() || !sessionId) return;

    const payload = { question, session_id: sessionId };
    const res = await axios.post('https://report-magician-backend.onrender.com/api/ask', payload);
    const answer = res.data.answer;

    setMessages([...messages, { question, answer }]);
    setQuestion('');
    setQuestionCount(prev => prev + 1);
  };

  const clearChat = () => {
    setMessages([]);
    setQuestionCount(0);
  };

  const downloadPDF = async () => {
    const res = await axios.get('https://report-magician-backend.onrender.com/api/export', {
      params: { session_id: sessionId, email, project_name: projectName },
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'report.pdf');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
      <h2>💬 Q&A</h2>
      <p>Questions asked: {questionCount}</p>
      {sessionId ? <p>Session: {sessionId}</p> : <p>No session detected. Upload files first.</p>}
      <textarea
        rows="3"
        value={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder="Ask something about your uploaded data..."
      />
      <br />
      <button onClick={askQuestion}>Ask</button>
      <button onClick={clearChat}>Clear Q&A</button>
      <button onClick={downloadPDF}>Download PDF</button>
      <div>
        {messages.map((msg, i) => (
          <div key={i}>
            <b>Q:</b> {msg.question}<br />
            <b>A:</b> {msg.answer}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QAChat;
