import React from 'react';

const UploadForm = () => {
  return (
    <div>
      <h2>Upload Excel files to S3 (private)</h2>
      <form>
        <input type="text" placeholder="Project Name" />
        <input type="file" accept=".xlsx,.xls" />
        <button type="submit">Upload to Report Magician</button>
      </form>
    </div>
  );
};

export default UploadForm;
