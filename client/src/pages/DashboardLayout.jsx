// src/layouts/DashboardLayout.jsx
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LogOut, FileText, UploadCloud, BarChart2, User, Home } from 'lucide-react';
import './Dashboard.css'; // or wherever your CSS is

const navItems = [
  { to: '/dashboard', icon: <Home size={18} />, label: 'Dashboard' },
  { to: '/upload', icon: <UploadCloud size={18} />, label: 'Upload File' },
  { to: '/history', icon: <FileText size={18} />, label: 'View History' },
  { to: '/insights', icon: <BarChart2 size={18} />, label: 'AI Insights' },
  { to: '/profile', icon: <User size={18} />, label: 'Profile' }
];

const DashboardLayout = () => {
  const location = useLocation();

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">Excel Analytics</div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-link ${location.pathname === item.to ? 'active' : ''}`}
            >
              {item.icon}<span style={{ marginLeft: 8 }}>{item.label}</span>
            </Link>
          ))}
        </nav>
        <Link to="/logout" className="logout-link">
          <LogOut size={18} /><span style={{ marginLeft: 8 }}>Logout</span>
        </Link>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1 className="main-heading">Excel Analytics Platform</h1>
        </header>
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
