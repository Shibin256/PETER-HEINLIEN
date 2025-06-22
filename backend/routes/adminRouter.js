import express from "express";
import multer from "multer";
import { verifyAccessToken } from "../middleware/authMiddleware.js";
import { deleteUser, getAllUsers, toggleUserBlock } from "../controller/admin/usersController.js";
import { createBrand, createCategory, deleteBrand, deleteCategory, editBrand } from "../controller/admin/inventoryController.js";

const router=express.Router()

const storage=multer.diskStorage({})
const upload=multer({storage})

router.get('/users/get',verifyAccessToken,getAllUsers)
router.patch('/block-toggle/:id',verifyAccessToken, toggleUserBlock);
router.delete('/delete/:id',verifyAccessToken,deleteUser)
router.post('/addCategory',verifyAccessToken,createCategory)
router.post('/addBrand',verifyAccessToken, upload.single('logo'), createBrand)
router.delete('/deleteCategory/:id',verifyAccessToken,deleteCategory)
router.delete('/deleteBrand/:id',verifyAccessToken,deleteBrand)
router.put('/editBrand/:id',verifyAccessToken,upload.single('logo'),editBrand)

export default router