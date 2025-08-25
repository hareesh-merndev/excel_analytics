// routes/upload.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import XLSX from 'xlsx';
import { verifyToken as authMiddleware } from '../middleware/auth.js';
import Upload from '../models/Upload.js';

const router = express.Router();

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder must exist
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// ✅ Upload Excel File and Parse
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    // Save to DB
    const newUpload = new Upload({
      filename: req.file.filename,
      path: req.file.path,
      user: req.user.id
    });
    await newUpload.save();

    // ✅ Parse Excel
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' }); // keep empty cells

    res.json({
      message: 'File uploaded and parsed successfully',
      data: rows
    });
  } catch (err) {
    console.error('❌ Upload parse error:', err);
    res.status(500).json({ error: 'Failed to process Excel file' });
  }
});

// ✅ Get Upload History
router.get('/history', authMiddleware, async (req, res) => {
  const uploads = await Upload.find({ user: req.user.id }).sort({ uploadedAt: -1 });
  res.json(uploads);
});

// ✅ Delete File by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  const upload = await Upload.findOne({ _id: req.params.id, user: req.user.id });
  if (!upload) return res.status(404).json({ error: 'File not found' });

  fs.unlink(upload.path, err => {
    if (err) console.error('File delete error:', err);
  });

  await upload.deleteOne();
  res.json({ message: 'Deleted successfully' });
});

export default router;
