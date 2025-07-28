import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://report-magic-backend.onrender.com";

export default function QAChat({
  sessionId: sessionIdProp,
  projectName,
  email,
  defaultMaxPreviewRows = 20,
}) {
  const [sessionId, setSessionId] = useState(
    sessionIdProp || localStorage.getItem("session_id") || ""
  );
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]); // { role: 'user' | 'assistant', text: string }
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [error, setError] = useState("");

  // Sync session id to localStorage any time it changes
  useEffect(() => {
    if (sessionId) localStorage.setItem("session_id", sessionId);
  }, [sessionId]);

  // Allow parent to update sessionId through prop
  useEffect(() => {
    if (sessionIdProp) {
      setSessionId(sessionIdProp);
    }
  }, [sessionIdProp]);

  const askQuestion = async (e) => {
    e?.preventDefault?.();
    setError("");

    if (!question.trim()) return;
    if (!sessionId) {
      setError("No session found. Please upload files first.");
      return;
    }

    const userMsg = { role: "user", text: question };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    try {
      const payload = {
        session_id: sessionId,
        question,
        project_name: projectName || "Unnamed Project",
        email: email || "Not provided",
        max_rows: defaultMaxPreviewRows,
      };

      const res = await axios.post(`${API_BASE}/api/ask`, payload);
      const answer = res.data?.answer || "(no answer returned)";
      const aiMsg = { role: "assistant", text: answer };

      setMessages((m) => [...m, aiMsg]);
      setQuestionCount((c) => c + 1);
    } catch (err) {
      console.error(err);
      setError("Failed to get an answer from the backend.");
    } finally {
      setLoading(false);
      setQuestion("");
    }
  };

  const clearHistory = async () => {
    setError("");
    setMessages([]);
    setQuestionCount(0);

    // Optional backend clear (requires /api/clear implementation)
    try {
      if (sessionId) {
        await axios.post(`${API_BASE}/api/clear`, { session_id: sessionId });
      }
    } catch (err) {
      // If endpoint doesn't exist, just ignore
      console.warn("Clear endpoint failed or not implemented.", err);
    }
  };

  const downloadPDF = () => {
    if (!sessionId) {
      setError("No session found. Please upload files first.");
      return;
    }
    window.open(`${API_BASE}/api/export?session_id=${sessionId}`, "_blank");
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>💬 Q&A</h2>

      <div style={{ marginBottom: 8, fontWeight: "bold" }}>
        Questions asked: {questionCount}
      </div>

      {sessionId ? (
        <div style={{ fontSize: 12, color: "#555" }}>
          Session: <code>{sessionId}</code>
        </div>
      ) : (
        <div style={{ fontSize: 12, color: "#c00" }}>
          No session detected. Upload files first.
        </div>
      )}

      <form onSubmit={askQuestion} style={{ marginTop: 12 }}>
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
          {loading ? "Thinking…" : "Ask"}
          </button>
          <button type="button" className="secondary" onClick={clearHistory}>
            Clear Q&A
          </button>
          <button type="button" className="secondary" onClick={downloadPDF}>
            Download PDF
          </button>
        </div>
      </form>

      {error && (
        <div style={{ color: "red", marginTop: 8 }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        {messages.length === 0 ? (
          <p style={{ color: "#777" }}>No messages yet.</p>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              style={{
                marginBottom: 12,
                background: m.role === "user" ? "#eef7ff" : "#f5f5f5",
                padding: 10,
                borderRadius: 6,
              }}
            >
              <strong>{m.role === "user" ? "You" : "AI"}:</strong> {m.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
