import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  investment: { type: mongoose.Schema.Types.ObjectId, ref: 'Investment', required: true },
  amount: { type: Number, required: true },
  type: {
    type: String,
    enum: ['investment', 'refund', 'payout'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'bank_transfer', 'upi', 'wallet'],
    required: true
  },
  transactionRef: { type: String, unique: true, required: true },
  transactionDate: { type: Date, default: Date.now }
});

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
