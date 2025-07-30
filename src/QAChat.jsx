import React from 'react';

const QAChat = () => {
  return (
    <div>
      <h2>💬 Q&A</h2>
      <p>Questions asked: 0</p>
      <textarea placeholder="Ask something about your uploaded data..."></textarea>
      <br />
      <button>Ask</button>
      <button>Clear Q&A</button>
      <button>Download PDF</button>
    </div>
  );
};

export default QAChat;
