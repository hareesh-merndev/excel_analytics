import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setForm({ username: '', password: '' });
    setError('');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      navigate(res.data.role === 'admin' ? '/admin' : '/dashboard');
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <section className="auth-section">
      <div className="background-grid">
        {Array.from({ length: 200 }).map((_, i) => <span key={i}></span>)}
      </div>
      <div className="signin">
        <div className="content">
          <h2>Sign In</h2>
          <form className="form" onSubmit={handleLogin}>
            <div className="inputBox">
              <input type="text" required value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
              <i>Username</i>
            </div>
            <div className="inputBox">
              <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              <i>Password</i>
            </div>
            {error && <div style={{ color: '#ff4d4f', textAlign: 'center' }}>{error}</div>}
            <div className="links">
              <Link to="#">Forgot Password</Link>
              <Link to="/register">Signup</Link>
            </div>
            <div className="inputBox">
              <input type="submit" value="Login" />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;