// src/pages/UploadPage.jsx
import React, { useState, useRef } from 'react';
import UploadExcel from '../components/UploadExcel';
import ChartComponent from '../components/ChartComponent';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './Dashboard.css';

const UploadPage = () => {
  const [data, setData] = useState([]);
  const [xKey, setXKey] = useState('');
  const [yKey, setYKey] = useState('');
  const [chartType, setChartType] = useState('2D');
  const [twoDType, setTwoDType] = useState('bar');
  const [threeDType, setThreeDType] = useState('scatter3d');
  const [showFullChart, setShowFullChart] = useState(false);
  const chartRef = useRef(null);

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  const handleDownloadPNG = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement('a');
    link.download = 'chart.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleDownloadPDF = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('chart.pdf');
  };

  return (
    <div className="dashboard-grid">
      {/* Upload Excel File */}
      <div className="dashboard-card upload-wrapper">
        <UploadExcel
          onUpload={(res) => {
            setData(res);
            setXKey('');
            setYKey('');
            localStorage.setItem('excelData', JSON.stringify(res)); // ✅ Store data for AI Insights
          }}
        />
        <p className="dashboard-note">Supports .xls, .xlsx</p>
      </div>

      {/* Chart Options */}
      {columns.length > 0 && (
        <div className="dashboard-card chart-options">
          <h3>📊 Select Chart Options</h3>

          <select className="dashboard-select" value={chartType} onChange={(e) => setChartType(e.target.value)}>
            <option value="2D">2D Chart</option>
            <option value="3D">3D Chart</option>
          </select>

          {!showFullChart && (
            <>
              <select className="dashboard-select" value={xKey} onChange={(e) => setXKey(e.target.value)}>
                <option value="">Select X-Axis</option>
                {columns.map((col) => (
                  <option key={col}>{col}</option>
                ))}
              </select>

              <select className="dashboard-select" value={yKey} onChange={(e) => setYKey(e.target.value)}>
                <option value="">Select Y-Axis</option>
                {columns.map((col) => (
                  <option key={col}>{col}</option>
                ))}
              </select>
            </>
          )}

          {chartType === '2D' && (
            <select className="dashboard-select" value={twoDType} onChange={(e) => setTwoDType(e.target.value)}>
              <option value="bar">Bar</option>
              <option value="line">Line</option>
              <option value="scatter">Scatter</option>
              <option value="heatmap">Heatmap</option>
              <option value="pie">Pie</option>
              <option value="donut">Donut</option>
              <option value="histogram">Histogram</option>
            </select>
          )}

          {chartType === '3D' && (
            <select className="dashboard-select" value={threeDType} onChange={(e) => setThreeDType(e.target.value)}>
              <option value="scatter3d">3D Scatter</option>
              <option value="surface">3D Surface</option>
              <option value="bar3d">3D Bar</option>
              <option value="heatmap3d">3D Heatmap</option>
            </select>
          )}

          <button className="dashboard-btn toggle-btn" onClick={() => setShowFullChart((prev) => !prev)}>
            {showFullChart ? 'Show X/Y Chart' : 'Show Full Chart'}
          </button>

          <div className="download-btn-group">
            <button className="dashboard-btn" onClick={handleDownloadPNG}>Download PNG</button>
            <button className="dashboard-btn" onClick={handleDownloadPDF}>Download PDF</button>
          </div>
        </div>
      )}

      {/* Render Chart */}
      {data.length > 0 && (showFullChart || (xKey && yKey)) && (
        <div className="dashboard-card chart-preview" ref={chartRef} style={{ gridColumn: 'span 2' }}>
          <ChartComponent
            data={data}
            xKey={xKey}
            yKey={yKey}
            chartType={chartType}
            twoDType={twoDType}
            threeDType={threeDType}
            fullTable={showFullChart}
          />
        </div>
      )}
    </div>
  );
};

export default UploadPage;
