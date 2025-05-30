import express from 'express'
import { adminLogin, googleAuth, login, refreshAccessToken, register, verifyOTP } from "../controller/authController.js";

const router=express.Router()
router.post('/register',register)
router.post('/verifyOTP',verifyOTP)
router.post('/google',googleAuth)
router.post('/login',login)
router.post('/admin-login',adminLogin)
router.post('/refresh-token',refreshAccessToken)
export default router