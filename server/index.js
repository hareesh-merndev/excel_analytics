const express = require('express');
const cors = require('cors');
const multer = require('multer');
const jwt = require('jsonwebtoken'); // if you're using auth
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Dummy JWT check middleware (you can replace this with real auth)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Multer config
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes

// ✅ Wake-up route
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Server is awake!' });
});

// ✅ Upload route
app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // You can parse the Excel file here using e.g., xlsx or exceljs
  // For now, just return success with a dummy response

  res.json({
    message: 'File uploaded successfully',
    data: {
      fileName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
