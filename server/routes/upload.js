import express from 'express';
import multer from 'multer';
import { verifyToken } from '../middleware/auth.js';
import XLSX from 'xlsx';
import path from 'path';

const router = express.Router();

// Set up multer storage to keep original file extension
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.post('/', verifyToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // Read uploaded Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    // Do NOT delete the file; keep it in uploads

    res.json({
      message: 'File uploaded and processed successfully',
      filename: req.file.filename,
      path: req.file.path,
      data: jsonData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to process Excel file' });
  }
});

export default router;