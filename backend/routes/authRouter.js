import express from 'express'
import { adminLogin, changePassword, fetchCurrentUser, forgotPass, googleAuth, login, refreshAccessToken, register, verifyOTP, verifyOTPForgotpass } from "../controller/authController.js";
import { verifyAccessToken } from "../middleware/authMiddleware.js";
import { validate } from '../middleware/validationMiddleware.js';
import { validateUserRegistration } from '../validators/authValidators.js';


const router=express.Router()
//authentication managing
router.post('/register',validateUserRegistration, validate,register)
router.post('/verifyOTP',verifyOTP)
router.post('/google',googleAuth)
router.post('/login',login)
router.post('/admin-login',adminLogin)

//token and fetch current user manage
router.get('/refresh-token',refreshAccessToken)
router.get('/me/:id',verifyAccessToken,fetchCurrentUser)

//forgot password managing
router.post('/forgotpass',forgotPass)
router.post('/verifyOTPForgotpass',verifyOTPForgotpass)
router.patch('/changePassword',changePassword)

export default router