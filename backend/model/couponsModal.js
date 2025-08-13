// models/Coupon.js
import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: [true, 'Coupon code is required'], 
    unique: true,
    trim: true,
    uppercase: true,
    minlength: [3, 'Coupon code must be at least 3 characters'],
    maxlength: [20, 'Coupon code must not exceed 20 characters']
  },
  discountType: { 
    type: String, 
    enum: {
      values: ['fixed', 'percentage'],
      message: 'Discount type must be either "fixed" or "percentage"'
    }, 
    required: [true, 'Discount type is required'] 
  },
  discountValue: { 
    type: Number, 
    required: [true, 'Discount value is required'],
    min: [1, 'Discount value must be at least 1'],
    validate: {
      validator: function(value) {
        if (this.discountType === 'percentage') {
          return value > 0 && value <= 100; 
        }
        return value > 0; 
      },
      message: props => 
        props.value > 100 
          ? 'Percentage discount cannot exceed 100%'
          : 'Discount value must be greater than 0'
    }
  }, 
  minOrderAmount: { 
    type: Number, 
    default: 0,
    min: [0, 'Minimum order amount cannot be negative']
  },
  isList: {
    type: Boolean,
    default: false
  },
  expiresAt: { 
    type: Date,
    validate: {
      validator: function(value) {
        return value > new Date(); 
      },
      message: 'Expiry date must be in the future'
    }
  },
  usageLimit: { 
    type: Number, 
    default: 0,
    min: [0, 'Usage limit cannot be negative']
  },
  usersUsed: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: []
  }],
}, { timestamps: true });

const Coupons = mongoose.model('Coupon', couponSchema);
export default Coupons;
