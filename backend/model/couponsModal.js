// models/Coupon.js
import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['fixed', 'percentage'], required: true },
  discountValue: { type: Number, required: true }, 
  minOrderAmount: { type: Number, default: 0 },
  // maxDiscountAmount: { type: Number },
  isList:{type:Boolean,default:false},
  expiresAt: { type: Date },
  usageLimit: { type: Number, default: 0 },
  usersUsed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User',default:[] }],
}, { timestamps: true });

const Coupons=mongoose.model('Coupon', couponSchema);
export default Coupons