import React, { useState } from 'react';
import axios from 'axios';

const clearHistory = async () => {
  try {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/clear`);
    alert("Q&A history cleared.");
  } catch (error) {
    console.error("Failed to clear history:", error);
  }
};

function QAChat() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question) return;

    setLoading(true);
    setAnswer('');

    try {
      const response = await axios.post(
        'https://report-magic-backend.onrender.com/api/ask',
        { question }
      );
      setAnswer(response.data.answer);
    } catch (error) {
      console.error('Error asking question:', error);
      setAnswer('❌ Error getting answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>💬 Ask a Question</h3>
      <form onSubmit={handleAsk}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask something about your uploaded data"
          style={{ width: '100%', padding: '0.5rem' }}
        />
        <button type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
          {loading ? 'Thinking...' : 'Ask'}
        <button onClick={clearHistory} style={{ marginTop: '10px' }}>
          🧹 Clear Q&A History  
        </button>
      </form>
        

      {answer && (
        <div style={{ marginTop: '1rem', background: '#f4f4f4', padding: '1rem' }}>
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default QAChat;
