import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "https://report-magician-backend.onrender.com";

export default function QAChat({ sessionId: sessionIdProp, projectName, email }) {
  const [sessionId, setSessionId] = useState(sessionIdProp || localStorage.getItem("session_id") || "");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (sessionIdProp) setSessionId(sessionIdProp);
  }, [sessionIdProp]);

  const ask = async (e) => {
    e?.preventDefault?.();
    setErr("");
    if (!sessionId) return setErr("No session detected. Upload files first.");
    if (!question.trim()) return;

    const userMsg = { role: "user", text: question };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE}/api/ask`, {
        session_id: sessionId,
        question,
        project_name: projectName,
        email,
        max_rows: 20,
      });
      const aiMsg = { role: "assistant", text: data?.answer || "(no answer)" };
      setMessages((m) => [...m, aiMsg]);
      setCount((c) => c + 1);
      setQuestion("");
    } catch (e2) {
      console.error(e2);
      setErr("Failed to get answer.");
    } finally {
      setLoading(false);
    }
  };

  const clearQA = async () => {
    try {
      await axios.post(`${API_BASE}/api/clear`, { session_id: sessionId });
    } catch (_) {
      // ignore
    }
    setMessages([]);
    setCount(0);
  };

  const downloadPDF = async () => {
    if (!sessionId) return setErr("No session detected. Upload files first.");
    try {
      const { data } = await axios.get(`${API_BASE}/api/export`, {
        params: { session_id: sessionId, expires_in: 3600 },
      });
      if (data?.pdf_url) window.open(data.pdf_url, "_blank");
      else setErr("Could not generate PDF.");
    } catch (e) {
      console.error(e);
      setErr("PDF export failed.");
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>💬 Q&A</h3>
      <div style={{ fontWeight: "bold", marginBottom: 6 }}>Questions asked: {count}</div>
      {sessionId ? (
        <div style={{ fontSize: 12, color: "#666" }}>
          Session: <code>{sessionId}</code>
        </div>
      ) : (
        <div style={{ fontSize: 12, color: "#c00" }}>No session detected. Upload files first.</div>
      )}
      <form onSubmit={ask} style={{ marginTop: 8 }}>
        <textarea
          rows={3}
          style={{ width: "100%", padding: 8 }}
          placeholder="Ask something about your uploaded data..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={loading}
        />
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <button type="submit" disabled={loading || !sessionId}>
            {loading ? "Thinking..." : "Ask"}
          </button>
          <button type="button" onClick={clearQA}>Clear Q&A</button>
          <button type="button" onClick={downloadPDF}>Download PDF</button>
        </div>
      </form>
      {err && <div style={{ color: "red", marginTop: 8 }}>{err}</div>}
      <div style={{ marginTop: 12 }}>
        {messages.length === 0 ? (
          <p style={{ color: "#777" }}>No messages yet.</p>
        ) : (
          messages.map((m, i) => (
            <div key={i} style={{ marginBottom: 10, background: m.role === "user" ? "#eef7ff" : "#f5f5f5", padding: 10, borderRadius: 6 }}>
              <strong>{m.role === "user" ? "You" : "AI"}:</strong> {m.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
