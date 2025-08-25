// src/components/UploadExcel.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './UploadExcel.css';

const UploadExcel = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [waking, setWaking] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  const handleUpload = async () => {
    if (!file) return alert('Please select a file');

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setProgress(0);

    try {
      const res = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        }
      });

      if (typeof onUpload === 'function') {
        onUpload(res.data.data);
      } else {
        console.warn('onUpload is not a function. Upload result:', res.data.data);
      }

      alert('✅ Upload successful!');
    } catch (err) {
      console.error('❌ Upload error:', err);
      if (err.response?.status === 404) {
        alert('❌ Upload failed: Backend route not found.');
      } else {
        alert('❌ Upload failed. Server may be asleep or unreachable.');
      }
    } finally {
      setUploading(false);
    }
  };

  const wakeServer = async () => {
    setWaking(true);
    try {
      await axios.get(`${API_BASE_URL}/ping`);
      alert('✅ Server is awake!');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to wake server.');
    } finally {
      setWaking(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h3>Select an Excel File</h3>
        <input
          type="file"
          accept=".xls,.xlsx"
          onChange={(e) => setFile(e.target.files[0])}
          className="upload-input"
        />
        {file && <p className="file-name">📄 {file.name}</p>}

        <div className="upload-buttons">
          <button
            className="dashboard-btn"
            onClick={handleUpload}
            disabled={uploading || waking}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          <button
            className="dashboard-btn"
            onClick={wakeServer}
            disabled={waking || uploading}
          >
            {waking ? 'Waking...' : 'Wake Server'}
          </button>
        </div>

        {uploading && (
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadExcel;
