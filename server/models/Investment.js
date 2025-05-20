import mongoose from 'mongoose';

const investmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: String, required: true },
  amountInvested: { type: Number, required: true },
  investmentDate: { type: Date, default: Date.now , required : true},
  sharesPercent: { type: Number },
  status: {
    type: String,
    enum: ['active', 'withdrawn', 'pending'],
    default: 'active'
  },
  returnsExpected: { type: Number },
  returnsReceived: { type: Number }
});

export default mongoose.models.Investment || mongoose.model('Investment', investmentSchema);
