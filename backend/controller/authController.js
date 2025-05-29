import User from "../model/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
//module for otp verification
import nodemailer from 'nodemailer'
import Otp from '../model/otpModel.js'
const saltround = parseInt(process.env.SALT_ROUNDS || "10", 10);

//google authontication
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//generate otp with random 6 digit number
function genarateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

//sending the email to the mail address 
async function sendVerificationEmail(email, otp) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      requireTLS: true,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD
      }

    })

    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: 'Verification Code',
      text: `Hello,
      Thank you for signing up on Peter Heinlien.
      Your One-Time Password (OTP) is: ${otp}
      Please enter this code in the verification screen to complete your registration. This OTP is valid for the next 10 minutes.
      If you did not request this, please ignore this email.
      Regards,  
      The Peter Heinlien Team`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <p>Hello,</p>
        <p>Thank you for signing up on <strong>Peter Heinlien</strong>.</p>
        <p>Your One-Time Password (OTP) is: <strong style="color: blue;">${otp}</strong></p>
            <p>Please enter this code in the verification screen to complete your registration. This OTP is valid for the next 10 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
            <p>Regards,<br>The Peter Heinlien Team</p>
          </div>
  `
    });

    return info.accepted.length > 0
  } catch (error) {
    console.log(error)
    return false
  }
}


export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      phone,
      gender,
      file,
    } = req.body;

    // Check if all required fields are present
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    // Passwords match check
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    //generate and sending otp
    const otp = genarateOtp()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    console.log('otp is:----',otp)

    await Otp.findOneAndDelete({ email }); // Remove any previous OTP
    await Otp.create({ email, otp,expiresAt });

    const emailSend = await sendVerificationEmail(email, otp)

    if (!emailSend) {
      return res.status(400).json({ message: "otp not send email error" });
    }

    return res.status(200).json({email})
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};




//verify otp
export const verifyOTP = async (req, res) => {
  try {
  console.log(req.body)
  const { formData,otp } = req.body;
  const {name,email,password,isAdmin,phone,gender,profileImage}=formData
  console.log('====name',name)
  const record = await Otp.findOne({ email, otp });
  console.log('--------',record)
  if (record) {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltround);
    // Create new user
    const user = await User.create({
      username: name,
      email,
      password: hashedPassword,
      isAdmin: false,
      phone,
      gender,
      profileImage, // Handle profile image upload if applicable
    });

    // // // Create token
    // // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    // //   expiresIn: "30d",
    // // });
    // console.log(token)

    // Send response
    res.status(201).json({
      message: "User registered successfully",
      // token,
      user: {
        _id: user._id,
        name: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

  }
    
  } catch (error) {
    console.log(error)
  }
  
}

//google auth
export const googleAuth=async(req,res)=>{
      const{idToken}=req.body
      try {
        const ticket=await client.verifyIdToken({
          idToken,
          audience:process.env.GOOGLE_CLIENT_ID,
        })

        const payload=ticket.getPayload()
        const { sub, email, name, picture,gender } = payload;
        
        let user = await User.findOne({ googleId: sub });

        if (!user) {
      user = await User.create({
        googleId: sub,
        username: name,
        email: email,
        avatar: picture,
        gender: 'other'
      });
    }

     const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, user });

      } catch (error) {
         console.error('Google login failed:', error);
         res.status(401).json({ error: 'Invalid Google token' });
      }
}




export const login=async(req,res)=>{
    try {
      const {email,password}=req.body
      const user = await User.findOne({ email })
      console.log(user)
       if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "30d" })

    // Send response with user data
    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });

    } catch (error) {
       console.error("Login error:", error);
        res.status(500).json({ message: "Error logging in" });
    }

}
