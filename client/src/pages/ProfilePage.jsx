// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RadialBarChart, RadialBar, Legend } from 'recharts';
import './Dashboard.css';

const ProfilePage = () => {
  const [username, setUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [uploads, setUploads] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [lastLogin, setLastLogin] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [changePwd, setChangePwd] = useState({ old: '', new: '' });

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: user } = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsername(user.username);
        setNewName(user.username);
        setLastLogin(new Date(user.lastLogin).toLocaleString());
        setCreatedAt(new Date(user.createdAt).toLocaleDateString());
        if (user.profilePicture) {
          setProfileImage(`${API_URL}/${user.profilePicture}`);
        }

        const { data: files } = await axios.get(`${API_URL}/upload/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUploads(files.slice(-5).reverse());
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [API_URL, token]);

  const handleUpdateName = async () => {
    if (!newName || newName === username) return;
    setUpdating(true);
    try {
      await axios.put(`${API_URL}/auth/update`, { username: newName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsername(newName);
      alert('✅ Username updated! Please re-login to reflect changes.');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to update username');
    } finally {
      setUpdating(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('picture', file);
    try {
      const res = await axios.post(`${API_URL}/auth/profile-picture`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setProfileImage(`${API_URL}/${res.data.path}`);
      alert('✅ Profile picture updated!');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to upload picture');
    }
  };

  const handlePasswordChange = async () => {
    if (!changePwd.old || !changePwd.new) return alert('Please fill both fields');
    try {
      await axios.post(`${API_URL}/auth/change-password`, changePwd, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Password changed successfully!');
      setChangePwd({ old: '', new: '' });
    } catch (err) {
      alert('❌ Password change failed');
      console.error(err);
    }
  };

  const chartData = [
    { name: 'Uploads', value: uploads.length, fill: '#00fff7' }
  ];

  return (
    <div className="dashboard-page full-screen">
      <div className="dashboard-card full-card" style={{ gridColumn: 'span 2' }}>
        <h3>User Profile</h3>

        {/* Profile Image Upload */}
        <div className="profile-image-wrapper">
          <img
            src={profileImage || '/default-avatar.png'}
            alt="Profile"
            className="profile-image"
          />
          <input
            type="file"
            accept="image/*"
            id="profileUpload"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          <button className="dashboard-btn" onClick={() => document.getElementById('profileUpload').click()}>
            Change Photo
          </button>
        </div>

        {/* Username Edit */}
        <label style={{ marginTop: 16 }}>Username:</label>
        <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          className="dashboard-select"
        />
        <button className="dashboard-btn" onClick={handleUpdateName} disabled={updating}>
          {updating ? 'Updating...' : 'Update Username'}
        </button>

        <p><strong>Account Created:</strong> {createdAt}</p>
        <p><strong>Last Login:</strong> {lastLogin}</p>

        {/* Password Section */}
        <h4 style={{ marginTop: 24 }}>Change Password</h4>
        <input
          type="password"
          placeholder="Old Password"
          className="dashboard-select"
          value={changePwd.old}
          onChange={e => setChangePwd({ ...changePwd, old: e.target.value })}
        />
        <input
          type="password"
          placeholder="New Password"
          className="dashboard-select"
          value={changePwd.new}
          onChange={e => setChangePwd({ ...changePwd, new: e.target.value })}
        />
        <button className="dashboard-btn" onClick={handlePasswordChange}>
          Change Password
        </button>

        {/* Upload Chart */}
        <h4 style={{ marginTop: 32 }}>Upload Analytics</h4>
        <RadialBarChart
          width={300}
          height={200}
          innerRadius="80%"
          outerRadius="100%"
          data={chartData}
          startAngle={180}
          endAngle={-180}
        >
          <RadialBar
            minAngle={15}
            background
            clockWise
            dataKey="value"
          />
          <Legend
            iconSize={10}
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            formatter={() => `${uploads.length} / 100 uploads`}
          />
        </RadialBarChart>

        {/* Upload Table */}
        <h4 style={{ marginTop: 24 }}>Recent Uploads (up to 5)</h4>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Filename</th>
              <th>Upload Date</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map(f => (
              <tr key={f._id}>
                <td>{f.filename}</td>
                <td>{new Date(f.uploadedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfilePage;
