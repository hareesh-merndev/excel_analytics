import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';

const isAuthenticated = () => !!localStorage.getItem('token');
const isAdmin = () => localStorage.getItem('role') === 'admin';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={isAuthenticated() ? <Dashboard /> : <Navigate to="/" />}
      />
      <Route
        path="/admin"
        element={isAuthenticated() && isAdmin() ? <AdminPanel /> : <Navigate to="/" />}
      />
    </Routes>
  );
};

export default App;
