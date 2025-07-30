import React from 'react';
import UploadForm from './UploadForm.jsx';
import QAChat from './QAChat.jsx';

const App = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧙‍♂️ Report Magician</h1>
      <UploadForm />
      <QAChat />
    </div>
  );
};

export default App;
