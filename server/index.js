// Load environment variables first
import dotenv from "dotenv";
dotenv.config();

// Import core modules
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Import routes
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import uploadRoutes from "./routes/upload.js";
import editRoute from "./routes/edit.js";
import insightRoutes from "./routes/insight.js";

const app = express();

// ✅ CORS Middleware (important for frontend on localhost:5173)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// ✅ Parse incoming JSON
app.use(express.json());

// ✅ Serve uploaded static files
app.use('/uploads', express.static('uploads'));

// ✅ Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/edit', editRoute);
app.use('/api/insight', insightRoutes); // ✅ Must come *after* middleware

// ✅ Health check route
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Server is awake!' });
});

// ✅ MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://hareeshragavan404:Hareesh948630@cluster0.yf5kjwd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectWithRetry = () => {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB connection error. Retrying in 5s...", err);
    setTimeout(connectWithRetry, 5000);
  });
};

connectWithRetry();

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
