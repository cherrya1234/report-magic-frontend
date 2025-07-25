import React from 'react';

function DownloadPDF() {
  const handleDownload = () => {
    window.open('https://report-magic-backend.onrender.com/api/export', '_blank');
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <button onClick={handleDownload} style={{ padding: '0.5rem 1rem' }}>
        📄 Download PDF Report
      </button>
    </div>
  );
}

export default DownloadPDF;
