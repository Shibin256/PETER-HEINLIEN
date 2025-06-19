import express from "express";
import multer from "multer";
import { verifyAccessToken } from "../middleware/authMiddleware.js";
import { deleteUser, getAllUsers, toggleUserBlock } from "../controller/admin/usersController.js";
import { createBrand, createCategory } from "../controller/admin/inventoryController.js";

const router=express.Router()

const storage=multer.diskStorage({})
const upload=multer({storage})

router.get('/users/get',getAllUsers)
router.patch('/block-toggle/:id', toggleUserBlock);
router.delete('/delete/:id',deleteUser)
router.post('/addCategory',createCategory)
router.post('/addBrand', upload.single('logo'), createBrand)
export default router