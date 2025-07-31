// models/Offer.js
import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    discountType: {
      type: String,
      enum: ['flat', 'percentage'],
      required: true,
    },
    discountValue: { type: Number, required: true },
    offerType: {
      type: String,
      enum: ['product', 'category'],
      required: true,
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // only if offerType is "product"
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // only if offerType is "category"
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Offer', offerSchema);
