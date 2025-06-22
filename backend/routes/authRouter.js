import express from 'express'
import { adminLogin, changePassword, fetchCurrentUser, forgotPass, googleAuth, login, refreshAccessToken, register, verifyOTP, verifyOTPForgotpass } from "../controller/authController.js";

const router=express.Router()
//authentication managing
router.post('/register',register)
router.post('/verifyOTP',verifyOTP)
router.post('/google',googleAuth)
router.post('/login',login)
router.post('/admin-login',adminLogin)

//token and fetch current user manage
router.post('/refresh-token',refreshAccessToken)
router.get('/me/:id',fetchCurrentUser)

//forgot password managing
router.post('/forgotpass',forgotPass)
router.post('/verifyOTPForgotpass',verifyOTPForgotpass)
router.patch('/changePassword',changePassword)

export default router