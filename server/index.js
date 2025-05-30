import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import uploadRoutes from "./routes/upload.js";

const app = express();
app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use(express.json());

// MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://YOUR_MONGO_URI";

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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
