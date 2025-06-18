import express from "express";
import multer from "multer";
import { verifyAccessToken } from "../middleware/authMiddleware.js";
import { deleteUser, getAllUsers, toggleUserBlock } from "../controller/admin/usersController.js";

const router=express.Router()

const storage=multer.diskStorage({})

router.get('/users/get',getAllUsers)
router.patch('/block-toggle/:id', toggleUserBlock);
router.delete('/delete/:id',deleteUser)
export default router