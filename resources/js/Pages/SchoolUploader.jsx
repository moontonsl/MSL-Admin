import { router } from '@inertiajs/react';
import React, { useState } from 'react';

const SchoolUploader = () => {
  const [jsonFile, setJsonFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleUpload = () => {
    if (!jsonFile) return alert("Please select a JSON file.");

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const schoolsData = JSON.parse(e.target.result);
        
        // Use Inertia's router.post
        router.post(route('/upload-schools'), { schools: schoolsData }, {
          onSuccess: () => setStatus("✅ Upload successful!"),
          onError: (errors) => setStatus("❌ Upload failed."),
        });
      } catch (err) {
        setStatus("❌ JSON parsing error: " + err.message);
      }
    };
    reader.readAsText(jsonFile);
  };

  return (
    <div>
      <h2>Upload School Data JSON</h2>
      <input type="file" accept=".json" onChange={(e) => setJsonFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
      <p>{status}</p>
    </div>
  );
};

export default SchoolUploader;
