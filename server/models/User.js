import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },  // Existing field (optional, could add validation)
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ['investor', 'admin', 'agent', 'guest'],
    default: 'investor'
  },
  aadhaarNumber: {
    type: String,
    length: 12,
    match: /^\d{12}$/, // Optional: Enforces 12-digit format
    unique: true,
    sparse: true
  },
  panNumber: {
    type: String,
    uppercase: true,
    match: /^[A-Z]{5}[0-9]{4}[A-Z]$/, // Validates standard PAN format
    unique: true,
    sparse: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', userSchema);
