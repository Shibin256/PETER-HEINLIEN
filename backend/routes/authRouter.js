import express from 'express'
import { googleAuth, login, register, verifyOTP } from "../controller/authController.js";

const router=express.Router()
router.post('/register',register)
router.post('/verifyOTP',verifyOTP)
router.post('/google',googleAuth)
router.post('/login',login)
export default router