import React, { useState } from "react";
import axios from "axios";

export default function ReportMagic() {
  const [files, setFiles] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [summary, setSummary] = useState("");

  const handleUpload = async (e) => {
    const fileList = Array.from(e.target.files);
    setFiles(fileList);
    const formData = new FormData();
    fileList.forEach(file => formData.append("files", file));

    const res = await axios.post("https://report-magic-backend.onrender.com/api/upload", formData);
    setSummary(res.data.summary);
  };

  const handleAsk = async () => {
    const res = await axios.post("https://report-magic-backend.onrender.com/api/ask", { question });
    setAnswer(res.data.answer);
  };

  const handleExport = async () => {
    const res = await axios.get("https://report-magic-backend.onrender.com/api/export", { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "report.pdf");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h1>📊 Report Magic</h1>
      <input type="file" multiple accept=".xls,.xlsx" onChange={handleUpload} />
      {summary && <pre>{summary}</pre>}
      <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask a question..." style={{ width: "100%", height: 100 }} />
      <button onClick={handleAsk}>Ask</button>
      {answer && <pre>{answer}</pre>}
      <button onClick={handleExport}>Export PDF</button>
    </div>
  );
}
