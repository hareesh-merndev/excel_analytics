// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const DashboardPage = () => {
  const [username, setUsername] = useState('');
  const [activity, setActivity] = useState([]);
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUsername(res.data.username);
      } catch (err) {
        console.error('Failed to fetch user info', err);
      }
    };

    const fetchActivity = async () => {
      try {
        const res = await axios.get(`${API_URL}/upload/history`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setActivity(res.data);
      } catch (err) {
        console.error('Failed to fetch history', err);
      }
    };

    fetchUser();
    fetchActivity();
  }, []);

  return (
    <div className="dashboard-page full-screen no-scroll dashboard-grid">
      {/* Welcome Section with Summary Boxes */}
      <div className="dashboard-card neon shortcut-card" style={{ gridColumn: 'span 2' }}>
        <h2>Welcome, {username} 👋</h2>
        <p className="dashboard-note">This is your AI-powered Excel Analytics dashboard.</p>
        <div className="shortcut-row">
          <div className="shortcut-box">⚡ Quick Start Guide</div>
          <div className="shortcut-box">🧠 Processing Power<br />12.5k Rows/sec</div>
          <div className="shortcut-box">💡 System Health<br />All Systems Operational</div>
        </div>
      </div>

      {/* What You Can Do */}
      <div className="dashboard-card landing-info">
        <h3>📊 What You Can Do Here</h3>
        <ul>
          <li>📥 Upload Excel files and parse their contents visually</li>
          <li>📈 Generate beautiful 2D/3D charts instantly</li>
          <li>🧠 Ask AI to edit or analyze your data</li>
          <li>🗃️ Track upload history with timestamps</li>
          <li>👤 Manage your profile and view file statistics</li>
        </ul>
      </div>

      {/* Shortcut Tiles */}
      <div className="dashboard-card shortcut-grid">
        <div className="shortcut-tile">📤 Upload New File</div>
        <div className="shortcut-tile">🕓 View History</div>
        <div className="shortcut-tile">🧠 AI Insights</div>
        <div className="shortcut-tile">👤 Your Profile</div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-card" style={{ flex: 1 }}>
        <h3>📅 Recent Activity</h3>
        <ul className="activity-list">
          {activity.slice(0, 5).map((item) => (
            <li key={item._id}>
              {item.filename} <span className="dashboard-date">{new Date(item.uploadedAt).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* System Status */}
      <div className="dashboard-card" style={{ flex: 1 }}>
        <h3>🧩 System Status</h3>
        <ul>
          <li>AI Processing Engine: <b style={{ color: 'lightgreen' }}>Operational</b></li>
          <li>Storage System: <b style={{ color: 'lightgreen' }}>Operational</b></li>
          <li>Analytics Engine: <b style={{ color: 'lightgreen' }}>Operational</b></li>
        </ul>
        <div style={{ marginTop: '12px' }}>
          <label style={{ color: '#00fff7' }}>Storage Usage</label>
          <div className="progress-bar" style={{ marginTop: '6px' }}>
            <div className="progress" style={{ width: '42%', background: '#00bfff' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
