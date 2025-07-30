import React, { useState } from 'react';
import UploadForm from './UploadForm';
import QAChat from './QAChat';

const App = () => {
  const [projectName, setProjectName] = useState('');
  const [email, setEmail] = useState('');
  const [sessionId, setSessionId] = useState(() => {
    // Generate a session ID once per load
    return crypto.randomUUID();
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧙‍♂️ Report Magician</h1>
      <UploadForm
        sessionId={sessionId}
        setProjectName={setProjectName}
        setEmail={setEmail}
        onUploadSuccess={(data) => {
          console.log('Upload success:', data);
        }}
      />
      <QAChat
        sessionId={sessionId}
        projectName={projectName}
        email={email}
      />
    </div>
  );
};

export default App;
