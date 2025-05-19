import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  price: { type: String, required: true },
  type: {
    type: String,
    enum: ['villa', 'apartment', 'land', 'commercial'],
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'sold', 'inactive'],
    default: 'available'
  },
  areaSqft: { type: Number },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  images: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Property || mongoose.model('Property', propertySchema);
