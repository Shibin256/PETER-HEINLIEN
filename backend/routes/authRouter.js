import express from 'express'
import { adminLogin, changePassword, fetchCurrentUser, forgotPass, googleAuth, login, refreshAccessToken, register, verifyOTP, verifyOTPForgotpass } from "../controller/authController.js";

const router=express.Router()
router.post('/register',register)
router.post('/verifyOTP',verifyOTP)
router.post('/google',googleAuth)
router.post('/login',login)
router.post('/admin-login',adminLogin)
router.post('/refresh-token',refreshAccessToken)
router.post('/forgotpass',forgotPass)
router.post('/verifyOTPForgotpass',verifyOTPForgotpass)
router.patch('/changePassword',changePassword)
router.get('/me/:id',fetchCurrentUser)
export default router