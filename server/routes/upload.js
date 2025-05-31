import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up multer storage with timestamped filenames
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ✅ Route: POST /api/upload
router.post('/', verifyToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Read uploaded Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    res.json({
      message: 'File uploaded and processed successfully',
      filename: req.file.filename,
      path: req.file.path,
      data: jsonData
    });
  } catch (err) {
    console.error('Excel processing failed:', err);
    res.status(500).json({ message: 'Failed to process Excel file' });
  }
});

// ✅ Optional: GET /api/upload/ping
router.get('/ping', (req, res) => {
  res.json({ message: 'Upload route is alive!' });
});

export default router;
