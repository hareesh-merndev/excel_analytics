import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';

const Register = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch {
      setError('Registration failed');
    }
  };

  return (
    <section className="auth-section">
      <div className="background-grid">
        {Array.from({ length: 200 }).map((_, i) => <span key={i}></span>)}
      </div>
      <div className="signin">
        <div className="content">
          <h2>Register</h2>
          <form className="form" onSubmit={handleRegister}>
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
              <Link to="/login">Already have an account?</Link>
            </div>
            <div className="inputBox">
              <input type="submit" value="Register" />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;