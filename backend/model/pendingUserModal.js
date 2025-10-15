import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  referralCode: String,
  otp: String,
  expiresAt: Date,
  gender:String
});


const PendingUser= mongoose.model("PendingUser", pendingUserSchema);
export default PendingUser
