// models/Upload.js
import mongoose from 'mongoose';

const uploadSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    default: 0, // in bytes
  },
  sheets: {
    type: Number,
    default: 0,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

const Upload = mongoose.model('Upload', uploadSchema);
export default Upload;
