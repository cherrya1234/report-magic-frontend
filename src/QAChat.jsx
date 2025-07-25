
import React, { useState } from 'react';
import axios from 'axios';

const QAChat = () => {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);

  const handleAsk = async () => {
    if (!question.trim()) return;
    const res = await axios.post('https://report-magic-backend.onrender.com/api/ask', { question });
    setAnswers([...answers, { question, answer: res.data.answer }]);
    setQuestion('');
  };

  const handleClear = () => {
    setAnswers([]);
  };

  const handleDownload = () => {
    window.open('https://report-magic-backend.onrender.com/api/export', '_blank');
  };

  return (
    <div>
      <h2>💬 Q&A Chat Interface</h2>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question..."
        style={{ width: '60%', padding: '8px', marginRight: '10px' }}
      />
      <button onClick={handleAsk}>Ask</button>
      <button onClick={handleClear} style={{ marginLeft: '10px' }}>Clear</button>
      <button onClick={handleDownload} style={{ marginLeft: '10px' }}>Download PDF</button>
      <div style={{ marginTop: '20px' }}>
        {answers.map((qa, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <strong>Q:</strong> {qa.question}<br />
            <strong>A:</strong> {qa.answer}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QAChat;
