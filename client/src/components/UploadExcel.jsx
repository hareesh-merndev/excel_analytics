import React, { useState } from 'react';
import axios from 'axios';

const UploadExcel = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert('Please select a file');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      onUpload(res.data.data);
      alert('Upload successful!');
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  return (
    <div style={{ margin: '20px 0' }}>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload} style={{ marginLeft: 10, padding: '5px 10px' }}>
        Upload
      </button>
    </div>
  );
};

export default UploadExcel;