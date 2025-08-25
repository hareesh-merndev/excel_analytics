import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Ensure uploads/profile folder exists
const profileUploadPath = 'uploads/profile';
if (!fs.existsSync(profileUploadPath)) {
  fs.mkdirSync(profileUploadPath, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, profileUploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

/**
 * GET /api/auth/me - Get current user details
 */
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      profilePicture: user.profilePicture || null,
    });
  } catch (err) {
    console.error('Error in /me route:', err);
    res.status(500).json({ error: 'Server error fetching user info' });
  }
});

/**
 * PUT /api/auth/update - Update username
 */
router.put('/update', verifyToken, async (req, res) => {
  const { username } = req.body;
  if (!username || username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters.' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.username = username;
    await user.save();
    res.json({ message: 'Username updated successfully' });
  } catch (err) {
    console.error('Username update error:', err);
    res.status(500).json({ error: 'Failed to update username' });
  }
});

/**
 * POST /api/auth/profile-picture - Upload profile picture
 */
router.post('/profile-picture', verifyToken, upload.single('picture'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.profilePicture = req.file.path.replace(/\\/g, '/'); // Normalize for Windows
    await user.save();

    res.json({ message: 'Profile picture uploaded', path: user.profilePicture });
  } catch (err) {
    console.error('Profile picture upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

/**
 * POST /api/auth/register - Register user
 */
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  let role = 'user';
  if (username === 'admin' && password === 'admin123') {
    role = 'admin';
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ username, password, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

/**
 * POST /api/auth/login - Login and update last login
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    user.lastLogin = new Date();
    await user.save();

    const payload = { id: user._id, username: user.username, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, role: user.role });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

/**
 * POST /api/auth/change-password - Change password
 */
router.post('/change-password', verifyToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({ message: 'Server error during password change' });
  }
});

export default router;
