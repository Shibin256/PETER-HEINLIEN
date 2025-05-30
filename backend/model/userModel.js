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
        unique:true,
        lowercase: true,
    },
    phone:{
        type:Number,
        required:false,
        unique:true,
        sparse:true,
        default:null
    },
    googleId:{
        type:String,
        unique:true,
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
    gender:{
        type:String,
        required:true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
})

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

const User = mongoose.model("User", userSchema);
export default User;


