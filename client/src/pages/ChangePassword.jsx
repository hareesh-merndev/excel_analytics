// Place this in a new file, e.g., ChangePassword.jsx
import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = () => {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '' });

  const handleChangePassword = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/auth/change-password',
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Password changed successfully!');
    } catch {
      alert('Failed to change password');
    }
  };

  return (
    <div>
      <input
        type="password"
        placeholder="Old Password"
        onChange={e => setForm({ ...form, oldPassword: e.target.value })}
      /><br />
      <input
        type="password"
        placeholder="New Password"
        onChange={e => setForm({ ...form, newPassword: e.target.value })}
      /><br />
      <button onClick={handleChangePassword}>Change Password</button>
    </div>
  );
};

export default ChangePassword;