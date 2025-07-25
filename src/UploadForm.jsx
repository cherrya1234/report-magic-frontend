import React, { useState } from "react";
import axios from "axios";

const UploadForm = () => {
  const [projectName, setProjectName] = useState("");
  const [email, setEmail] = useState("");
  const [files, setFiles] = useState([]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files.length) return;

    const formData = new FormData();
    for (let file of files) {
      formData.append("files", file);
    }
    formData.append("session_id", `${projectName}-${Date.now()}`);

    const API_BASE = import.meta.env.VITE_API_BASE;
    await axios.post(`${API_BASE}/api/upload`, formData);
    alert("Files uploaded!");
  };

  return (
    <form onSubmit={handleUpload}>
      <input
        type="text"
        placeholder="Project Name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="file"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files))}
        accept=".xlsx, .xls"
      />
      <button type="submit">Upload to Report Magic</button>
    </form>
  );
};

export default UploadForm;
