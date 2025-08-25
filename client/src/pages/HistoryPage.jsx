// src/pages/HistoryPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const HistoryPage = () => {
  const [files, setFiles] = useState([]);

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/upload/history`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setFiles(res.data);
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      await axios.delete(`${API_URL}/upload/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchHistory();
    } catch (err) {
      alert('❌ Failed to delete');
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-card history-card" style={{ gridColumn: 'span 2' }}>
        <h3>📁 Upload History</h3>
        {files.length === 0 ? (
          <p className="dashboard-note">No files uploaded yet.</p>
        ) : (
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Filename</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map(file => (
                  <tr key={file._id}>
                    <td className="truncate">{file.filename}</td>
                    <td>{new Date(file.uploadedAt).toLocaleDateString()}</td>
                    <td className="action-buttons">
                      <button className="dashboard-btn" onClick={() => alert('Show chart logic')}>
                        Show Chart
                      </button>
                      <button className="dashboard-btn delete-btn" onClick={() => handleDelete(file._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
