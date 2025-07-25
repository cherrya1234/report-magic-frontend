import React from 'react';
import UploadForm from './UploadForm';
import QAChat from './QAChat';
import DownloadPDF from './DownloadPDF';

function App() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <h1>📊 Report Magic</h1>
      <UploadForm />
      <QAChat />
      <DownloadPDF />
    </div>
  );
}

export default App;
