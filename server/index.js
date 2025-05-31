import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import uploadRoutes from "./routes/upload.js";

const app = express();

// Enable serving static files from uploads folder
app.use('/uploads', express.static('uploads'));

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB URI (secure via .env in production)
const MONGODB_URI = process.env.MONGODB_URI || "your-fallback-mongo-uri";

// Auto-retry MongoDB connection
const connectWithRetry = () => {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB connection error. Retrying in 5s...", err);
    setTimeout(connectWithRetry, 5000); // Retry every 5 seconds
  });
};

connectWithRetry();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// ✅ Health check route for Render/Netlify
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Server is awake!' });
});

// ✅ Fallback for non-API requests (optional, for SPA support)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build'))); // If React is built into /client
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
