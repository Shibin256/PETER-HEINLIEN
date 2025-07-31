import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paymentId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  description: { type: String },
},{timestamps: true,});

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balance: { type: Number, default: 0, min: 0 },
  transactions: [transactionSchema]
});

const Wallet = mongoose.model('Wallet', walletSchema);
export default Wallet;
 