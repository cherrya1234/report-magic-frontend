import React, { useState } from 'react';
import UploadForm from './UploadForm.jsx';
import QAChat from './QAChat.jsx';

const App = () => {
  const [sessionId, setSessionId] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>🧙‍♂️ Report Magician</h1>

      <UploadForm
        sessionId={sessionId}
        setSessionId={setSessionId}
        setProjectName={setProjectName}
        setEmail={setEmail}
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
