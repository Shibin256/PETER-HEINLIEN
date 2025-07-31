import User from "../model/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
//module for otp verification
import nodemailer from 'nodemailer'
import { v4 as uuidv4 } from 'uuid';
import Otp from '../model/otpModel.js'
const saltround = parseInt(process.env.SALT_ROUNDS || "10", 10);

//google authontication
import { OAuth2Client } from 'google-auth-library';
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import Product from "../model/productModel.js";
import Wallet from "../model/walletModal.js";
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


// user registration 
export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      phone,
      ReferralCode
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
    const userExist = await User.findOne({ email }).select('-password');
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const phoneExist = await User.findOne({ phone }).select('-password');
    if (phoneExist && phoneExist.phone != null) {
      return res.status(400).json({ message: "The mobile number is already exists" });
    }

    const ReferralUser = await User.findOne({ referralCode:ReferralCode }).select('-password')

    if (ReferralUser) {
      let wallet = await Wallet.findOne({ userId: ReferralUser._id })
      const transactions = {
        userId: ReferralUser._id,
        amount: 50,
        paymentId: `REF-${Date.now()}-${uuidv4().slice(0, 8)}`,
        status: 'success',
        type: 'credit',
        description: ' Referral Amount'
      }
      if (wallet) {
        wallet.balance +=50;
        wallet.transactions.push(transactions)
      } else {
        wallet = new Wallet({ userId:ReferralUser._id, balance: 50, transactions: [transactions] });
      }
      await wallet.save();
    }

    //generate and sending otp
    const otp = genarateOtp()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    console.log('otp is:----', otp)
    // Remove any previous OTP
    await Otp.findOneAndDelete({ email });
    await Otp.create({ email, otp, expiresAt });

    //Otp sending to the corresponding email
    const emailSend = await sendVerificationEmail(email, otp)
    if (!emailSend) {
      return res.status(400).json({ message: "otp not send email error" });
    }

    return res.status(200).json(
      { message: 'The otp send to the email', email })
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};




//verify otp after register with form data
export const verifyOTP = async (req, res) => {
  try {
    const { formData, otp } = req.body;
    const { name, email, password, phone, gender } = formData
    const record = await Otp.findOne({ email, otp });
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
      });

      // Send response
      res.status(201).json({
        message: "User registered successfully",
        user: {
          _id: user._id,
          name: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });

    } else {
      console.log('The otp is not matching')
      res.status(400).json({ message: "The otp is not matching" })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error logging in" });
  }
}

//google auth for user
export const googleAuth = async (req, res) => {
  const { idToken } = req.body
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    const { sub, email, name, picture } = payload;

    let user = await User.findOne({ googleId: sub });

    if (!user) {
      user = await User.create({
        googleId: sub,
        username: name,
        email: email,
        avatar: picture,
        gender: 'other',
        isAuthenticated: true
      });
    } else {
      user.isAuthenticated = true;
      await user.save();
    }

    //generatind access and refresh token
    const accessToken = generateAccessToken(user)
    console.log(accessToken)
    const refreshToken = generateRefreshToken(user)
    console.log(refreshToken)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({ accessToken, user });
  } catch (error) {
    console.error('Google login failed:', error);
    res.status(401).json({ error: 'Invalid Google token' });
  }
}


// user login section
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })


    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (user.googleId) {
      return res.status(401).json({ message: 'user not exist, try google login' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.isAdmin) {
      return res.status(401).json({ message: 'The user is admin, cant join thorugh this' })
    }

    if (user.isBlocked) {
      return res.status(401).json({ message: 'The user is blocked form using the site, cant join' })
    }

    user.isAuthenticated = true;
    await user.save();

    //creation of access and refresh Token when user log in
    const accessToken = generateAccessToken(user)
    console.log(accessToken, ':accesssToken')
    const refreshToken = generateRefreshToken(user)
    console.log(refreshToken, ':reresh token')


    //storing refreshToken into cookies
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    // Send response with user data
    res.json({
      message: "Login successful",
      accessToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        phone: user.phone,
        gender: user.gender,
        profileImage: user.profileImage,
        referralCode:user.referralCode
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
}

//admin login section
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    console.log("Admin login attempt for email:", email);

    const user = await User.findOne({ email })

    if (!user) {
      console.log('Admin login failed: User not found');
      return res.status(401).json({ message: 'admin not found in this email' })
    }

    if (!user.isAdmin) {
      console.log('The user is not an admin')
      return res.status(401).json({ message: 'user is not an admin' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      console.log('Admin login is failed, the password not match')
      return res.status(401).json({ message: 'admin login is failed, password not matches' })
    }

    console.log('admin login is successfull')

    user.isAuthenticated = true;
    await user.save();

    //creation of access and refresh Token when user log in
    console.log(user, 'user in access')
    const accessToken = generateAccessToken(user)
    console.log(accessToken)
    const refreshToken = generateRefreshToken(user)
    console.log(refreshToken)

    //storing refreshToken into cookies
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    //store cookkie in db tooo
    res.json({
      message: 'admin login is successfull',
      accessToken,
      user: {
        _id: user._id,
        email: user.email,
        isAdmin: true
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
}


//refresh accessToken from cokies without asking the user to log again
export const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);

    const newAccessToken = generateAccessToken({ _id: decoded.id });
    res.json({ accessToken: newAccessToken });
  });
};


//forgot password manage
export const forgotPass = async (req, res) => {
  try {
    const { email } = req.body;
    console.log('email ======', email);

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const otp = genarateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    console.log('otp is: ----', otp);

    // Remove any previous OTP
    await Otp.findOneAndDelete({ email });
    await Otp.create({ email, otp, expiresAt });

    const emailSend = await sendVerificationEmail(email, otp);
    if (!emailSend) {
      return res.status(400).json({ message: "OTP not sent. Email error." });
    }

    return res.status(200).json({ message: 'The OTP has been sent to the email', email });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//verification of forgot password with email
export const verifyOTPForgotpass = async (req, res) => {
  try {

    const { formData, otp } = req.body;
    const email = formData.email
    const record = await Otp.findOne({ email, otp });
    if (record) {
      res.status(201).json({
        message: "OTP verified successfully",
      });
    } else {
      console.log('The otp is not matching')
      res.status(400).json({ message: "The otp is not matching" })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error logging in" });
  }
}

// creating new password
export const changePassword = async (req, res) => {
  try {
    const { newPassword, email } = req.body
    const user = await User.findOne({ email })

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.isBlocked) return res.status(404).json({ message: 'User cant access anything' });

    const hashedPassword = await bcrypt.hash(newPassword, saltround);

    user.password = hashedPassword
    await user.save()
    res.status(200).json({ message: 'User Password changed successfully' })

  } catch (error) {
    console.error('Error while changing User password:', error.message);
    res.status(500).json({ message: 'Server error changing password' });

  }

}

// fetch current user who logged in
export const fetchCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });

  }

}