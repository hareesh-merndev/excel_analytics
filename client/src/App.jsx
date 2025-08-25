// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import DashboardLayout from './pages/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import HistoryPage from './pages/HistoryPage';
import AIInsightsPage from './pages/AIInsightsPage';
import ProfilePage from './pages/ProfilePage';

const isAuthenticated = () => !!localStorage.getItem('token');
const isAdmin = () => localStorage.getItem('role') === 'admin';

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Route */}
      <Route
        path="/admin"
        element={isAuthenticated() && isAdmin() ? <AdminPanel /> : <Navigate to="/login" />}
      />

      {/* Protected Layout and Nested Routes */}
      <Route
        path="/"
        element={isAuthenticated() ? <DashboardLayout /> : <Navigate to="/login" />}
      >
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="insights" element={<AIInsightsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Catch-all Route */}
      <Route 
        path="*" 
        element={<Navigate to="/login" />} 
      />
    </Routes>
  );
};

export default App;