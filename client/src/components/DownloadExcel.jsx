import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const DownloadExcel = ({ data }) => {
  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'ModifiedExcel.xlsx');
  };

  return (
    <button onClick={handleDownload} className="dashboard-btn" style={{ marginTop: 12 }}>
      Download Modified Excel
    </button>
  );
};

export default DownloadExcel;
