import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Dashboard.css';

const Register = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch {
      setError('Registration failed');
    }
  };

  return (
    <div className="auth-bg">
      <div className="dashboard-card neon auth-card" style={{ maxWidth: 400, width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Register</h2>
        <input
          className="dashboard-select auth-input"
          placeholder="Username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
        />
        <input
          className="dashboard-select auth-input"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        {error && <div style={{ color: '#ff4d4f', marginBottom: 12 }}>{error}</div>}
        <button className="dashboard-btn" style={{ width: '100%' }} onClick={handleRegister}>
          Register
        </button>
        <p style={{ marginTop: 16, textAlign: 'center' }}>
          Already have an account? <Link to="/login" className="dashboard-link">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;