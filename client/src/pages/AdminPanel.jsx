import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:5000/api/admin/users', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setUsers(res.data);
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    fetchUsers();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    if (localStorage.getItem('role') !== 'admin') {
      navigate('/');
    } else {
      fetchUsers();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="auth-bg">
      <div className="dashboard-card neon auth-card" style={{ maxWidth: 700, width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Admin Panel</h2>
        <button className="dashboard-btn" style={{ marginBottom: 18 }} onClick={handleLogout}>
          Logout
        </button>
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user =>
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="dashboard-btn"
                      style={{ padding: '4px 12px', fontSize: '0.95em' }}
                      onClick={() => deleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;