// File: server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from "cors";
import User from './models/User.js';
import Property from './models/Property.js';
import Investment from './models/Investment.js';
import Transaction from './models/Transaction.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo Error:", err));

// Auth Middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid Token' });
  }
};


app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, aadhaarNumber, panNumber } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role, phone, aadhaarNumber, panNumber });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.get('/api/users/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: 'User not found' });
  }
});

// Property Routes
app.post('/api/properties', auth, async (req, res) => {
  try {
    const property = await Property.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(property);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/properties', async (req, res) => {
  const properties = await Property.find();
  res.json(properties);
});

app.get('/api/properties/:id', async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) return res.status(404).json({ message: 'Not found' });
  res.json(property);
});

// Investment Routes
app.post('/api/investments', auth, async (req, res) => {
  try {
    const { property, amountInvested, sharesPercent } = req.body;
    const investment = await Investment.create({ user: req.user.id, property, amountInvested, sharesPercent });
    res.status(201).json(investment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/investments/user/:userId', auth, async (req, res) => {
  const investments = await Investment.find({ user: req.params.userId }).populate('property');
  res.json(investments);
});

// Transaction Routes
app.post('/api/transactions', auth, async (req, res) => {
  try {
    const transaction = await Transaction.create({ ...req.body, user: req.user.id });
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/transactions/user/:userId', auth, async (req, res) => {
  const transactions = await Transaction.find({ user: req.params.userId });
  res.json(transactions);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
