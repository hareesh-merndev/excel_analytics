import React, { useState, useEffect, useRef } from 'react';
import UploadExcel from '../components/UploadExcel';
import ChartComponent from '../components/ChartComponent';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [xKey, setXKey] = useState('');
  const [yKey, setYKey] = useState('');
  const [chartType, setChartType] = useState('2D');
  const [twoDType, setTwoDType] = useState('scatter');
  const [showFullChart, setShowFullChart] = useState(false);
  const [users, setUsers] = useState([]);
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const chartRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  // Fetch all users if admin
  useEffect(() => {
    if (role === 'admin') {
      axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then(res => setUsers(res.data));
    }
  }, [role]);

  // Download chart as PNG
  const handleDownloadPNG = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement('a');
    link.download = 'chart.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  // Download chart as PDF
  const handleDownloadPDF = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('chart.pdf');
  };

  return (
    <div className="dashboard-grid">
      {/* Top Left: Upload */}
      <div className="dashboard-card neon">
        <h3>Upload Your Excel File</h3>
        <UploadExcel onUpload={setData} />
        <p className="dashboard-note">Supported formats: xlsx, xls</p>
      </div>
      {/* Top Right: Select Columns */}
      <div className="dashboard-card neon">
        <h3>Select Columns for Chart</h3>
        {columns.length > 0 && (
          <>
            <div style={{ marginBottom: 12 }}>
              <select onChange={e => setXKey(e.target.value)} className="dashboard-select" style={{ width: '100%' }}>
                <option value="">X-Axis</option>
                {columns.map(col => <option key={col}>{col}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <select onChange={e => setYKey(e.target.value)} className="dashboard-select" style={{ width: '100%' }}>
                <option value="">Y-Axis</option>
                {columns.map(col => <option key={col}>{col}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <select onChange={e => setChartType(e.target.value)} className="dashboard-select" style={{ width: '100%' }}>
                <option value="2D">2D</option>
                <option value="3D">3D</option>
              </select>
            </div>
            {chartType === '2D' && (
              <div style={{ marginBottom: 12 }}>
                <select onChange={e => setTwoDType(e.target.value)} className="dashboard-select" style={{ width: '100%' }}>
                  <option value="scatter">Scatter</option>
                  <option value="line">Line</option>
                  <option value="bar">Bar</option>
                  <option value="heatmap">Heatmap</option>
                </select>
              </div>
            )}
            <button
              className="dashboard-btn"
              style={{ width: '100%' }}
              onClick={() => setShowFullChart(!showFullChart)}
            >
              {showFullChart ? 'Show X/Y Chart' : 'Show Full Chart'}
            </button>
          </>
        )}
      </div>
      {/* Bottom Left: Chart */}
      <div className="dashboard-card neon chart">
        <h3>Chart</h3>
        <div ref={chartRef}>
          {showFullChart && data.length > 0 && (
            <ChartComponent data={data} chartType={chartType} twoDType={twoDType} fullTable />
          )}
          {!showFullChart && xKey && yKey && (
            <ChartComponent data={data} xKey={xKey} yKey={yKey} chartType={chartType} twoDType={twoDType} />
          )}
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 16 }}>
          <button className="dashboard-btn" onClick={handleDownloadPNG}>Download PNG</button>
          <button className="dashboard-btn" onClick={handleDownloadPDF}>Download PDF</button>
        </div>
      </div>
      {/* Bottom Right: Dashboard Info */}
      <div className="dashboard-card neon">
        <h3>Your Dashboard</h3>
        <div>
          <b>Recent Uploads</b>
          <ul>
            <li>sales_data.xlsx <span className="dashboard-date">2025-05-26</span></li>
            <li>marketing_stats.xlsx <span className="dashboard-date">2025-05-25</span></li>
            <li>finance_report.xls <span className="dashboard-date">2025-05-24</span></li>
            <li>employee_list.xlsx <span className="dashboard-date">2025-05-23</span></li>
          </ul>
          <b>Saved Analyses</b>
          <ul>
            <li>Sales Q1 Analysis</li>
            <li>Customer Growth 3D View</li>
          </ul>
          {role === 'admin' && (
            <>
              <b>All Users (Admin Only)</b>
              <ul>
                {users.map(u => (
                  <li key={u._id}>
                    {u.username} <span className="dashboard-date">{u._id}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <button className="dashboard-btn" style={{ marginTop: 12 }}>Upload New File</button>
        <div style={{ height: 18 }}></div>
        <button className="dashboard-btn" style={{ marginBottom: 18 }} onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;