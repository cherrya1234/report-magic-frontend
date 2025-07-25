import React, { useState } from "react";
import axios from "axios";

function App() {
  const [projectName, setProjectName] = useState("");
  const [email, setEmail] = useState("");
  const [files, setFiles] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));
    formData.append("session_id", projectName);

    try {
      const uploadRes = await axios.post(
        "https://report-magic-backend.onrender.com/api/upload",
        formData
      );
      console.log("Upload response:", uploadRes.data);
    } catch (err) {
      alert("Upload failed");
    }
  };

  const handleAsk = async () => {
    try {
      const res = await axios.post("https://report-magic-backend.onrender.com/api/ask", {
        question
      });
      setAnswer(res.data.answer);
    } catch (err) {
      alert("Q&A failed");
    }
  };

  const handleExport = async () => {
    const res = await axios.get("https://report-magic-backend.onrender.com/api/export", {
      responseType: "blob"
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "report.pdf");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>📊 Report Magic</h1>
      <input
        type="text"
        placeholder="Project Name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="file"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files))}
      />
      <textarea
        placeholder="Ask a question about your data..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={3}
      />
      <div>
        <button onClick={handleUpload}>Upload</button>
        <button onClick={handleAsk}>Ask</button>
        <button onClick={handleExport}>Download PDF</button>
      </div>
      {answer && (
        <div style={{ marginTop: 20 }}>
          <strong>AI:</strong> {answer}
        </div>
      )}
    </div>
  );
}

export default App;
