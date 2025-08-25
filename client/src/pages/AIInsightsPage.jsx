// src/pages/AIInsightsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './Dashboard.css';

const AIInsightsPage = () => {
  const [data, setData] = useState([]);
  const [instruction, setInstruction] = useState('');
  const [insight, setInsight] = useState('');

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  // Load uploaded data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('excelData');
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (err) {
        console.error('Failed to parse stored data:', err);
      }
    }
  }, []);

  const handleInstruction = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/edit`,
        { instruction, data },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(res.data);
    } catch (err) {
      console.error('Edit Error:', err);
      alert('❌ Failed to apply AI edit');
    }
  };

  const handleInsights = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/insight`,
        { data },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInsight(res.data.message);
    } catch (err) {
      console.error('Insight Error:', err);
      alert('❌ Failed to fetch AI insights');
    }
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'AI_Modified_Data');
    XLSX.writeFile(workbook, 'AI_Modified_Data.xlsx');
  };

  return (
    <div className="dashboard-page full-width-page">
      <div className="dashboard-card full-card">
        <h3>🤖 AI Insights</h3>

        {data.length > 0 ? (
          <pre style={{
            whiteSpace: 'pre-wrap',
            background: '#111b2a',
            color: '#00fff7',
            padding: '12px',
            borderRadius: '8px',
            maxHeight: '300px',
            overflowY: 'auto',
            marginBottom: '16px'
          }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        ) : (
          <p className="dashboard-note">📄 No data found. Please upload a file from the Upload page.</p>
        )}

        <textarea
          className="dashboard-select"
          placeholder="Give an instruction (e.g., Rename all 'John' to 'Hari')"
          value={instruction}
          onChange={e => setInstruction(e.target.value)}
          rows={3}
        />

        <div className="ai-action-group" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
          <button className="dashboard-btn" onClick={handleInstruction}>Ask AI to Modify</button>
          <button className="dashboard-btn" onClick={handleInsights}>Generate AI Insights</button>
          <button className="dashboard-btn" onClick={handleDownloadExcel}>Download Excel</button>
        </div>

        {insight && (
          <p className="dashboard-note" style={{ marginTop: 12, whiteSpace: 'pre-line' }}>
            {insight}
          </p>
        )}
      </div>
    </div>
  );
};

export default AIInsightsPage;
