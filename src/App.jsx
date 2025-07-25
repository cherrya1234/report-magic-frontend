
import React, { useState } from 'react';
import QAChat from './QAChat.jsx';
import UploadForm from './UploadForm.jsx';

const App = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>📊 Report Magic</h1>
      <UploadForm />
      <QAChat />
    </div>
  );
};

export default App;
