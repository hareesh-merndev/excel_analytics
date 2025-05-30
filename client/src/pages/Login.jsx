import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Dashboard.css';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setForm({ username: '', password: '' });
    setError('');
  }, []);

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      if (res.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="auth-bg">
      <div className="dashboard-card neon auth-card" style={{ maxWidth: 400, width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Login</h2>
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
        <button className="dashboard-btn" style={{ width: '100%' }} onClick={handleLogin}>
          Login
        </button>
        <p style={{ marginTop: 16, textAlign: 'center' }}>
          No account? <Link to="/register" className="dashboard-link">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;