import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "https://report-magician-backend.onrender.com";

export default function UploadForm({ onSession }) {
  const [projectName, setProjectName] = useState("");
  const [email, setEmail] = useState("");
  const [files, setFiles] = useState([]);
  const [sessionId, setSessionId] = useState(localStorage.getItem("session_id") || "");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (sessionId) localStorage.setItem("session_id", sessionId);
  }, [sessionId]);

  const onFileChange = (e) => setFiles(Array.from(e.target.files || []));

  const upload = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!projectName.trim() || !email.trim()) {
      setMessage("Please enter project name and email.");
      return;
    }
    if (!files.length) {
      setMessage("Please choose at least one Excel file.");
      return;
    }

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    formData.append("project_name", projectName);
    formData.append("email", email);
    if (sessionId) formData.append("session_id", sessionId);

    setBusy(true);
    try {
      const res = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const sid = res.data?.session_id;
      if (sid) {
        setSessionId(sid);
        onSession?.(sid, projectName, email);
      }
      setMessage("✅ Upload successful. You can now ask questions.");
      console.log("File summaries:", res.data?.files);
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <form onSubmit={upload}>
        <div style={{ marginBottom: 8 }}>
          <label>Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter a project name"
            style={{ display: "block", width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Your Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{ display: "block", width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Excel Files (.xlsx / .xls)</label>
          <input type="file" accept=".xlsx,.xls" multiple onChange={onFileChange} />
        </div>
        <button type="submit" disabled={busy}>
          {busy ? "Uploading..." : "Upload to Report Magician"}
        </button>
      </form>
      {message && <p style={{ marginTop: 8 }}>{message}</p>}
    </div>
  );
}
