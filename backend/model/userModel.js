import mongoose from "mongoose"
import jwt from "jsonwebtoken";
export const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    phone: {
        type: Number,
        required: false,
        unique: true,
        sparse: true,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true

    },
    password: {
        type: String,
        required: false,
    },
    profileImage: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isAuthenticated: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    referralCode: { type: String, unique: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
}, {
    timestamps: true
})

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// Auto-generate referral code for each new user
userSchema.pre("save", function (next) {
    if (!this.referralCode) {
        this.referralCode = "REF" + Math.random().toString(36).substring(2, 8).toUpperCase();
    }
    next();
});

const User = mongoose.model("User", userSchema);
export default User;


