import React, { useState } from 'react';
import UploadForm from './UploadForm';
import QAChat from './QAChat';

const App = () => {
  const [sessionId, setSessionId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [email, setEmail] = useState('');
  const [questionCount, setQuestionCount] = useState(0);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧙‍♂️ Report Magician</h1>
      <UploadForm
        sessionId={sessionId}
        setSessionId={setSessionId}
        projectName={projectName}
        setProjectName={setProjectName}
        email={email}
        setEmail={setEmail}
      />
      <QAChat
        sessionId={sessionId}
        projectName={projectName}
        email={email}
        questionCount={questionCount}
        setQuestionCount={setQuestionCount}
      />
    </div>
  );
};

export default App;
