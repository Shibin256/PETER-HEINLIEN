import express from "express";
import multer from "multer";
import { verifyAccessToken } from "../middleware/authMiddleware.js";
import { deleteUser, getAllUsers, toggleUserBlock } from "../controller/admin/usersController.js";
import { createBrand, createCategory, deleteBrand, deleteCategory, editBrand } from "../controller/admin/inventoryController.js";
import { createBanner } from "../controller/admin/bannerController.js";

const router=express.Router()

const storage=multer.diskStorage({})
const upload=multer({storage})


// user managing
router.get('/users/get',verifyAccessToken,getAllUsers)
router.patch('/block-toggle/:id',verifyAccessToken, toggleUserBlock);
router.delete('/delete/:id',verifyAccessToken,deleteUser)

//category managing
router.post('/addCategory',verifyAccessToken,createCategory)
router.delete('/deleteCategory/:id',verifyAccessToken,deleteCategory)

//brand managing
router.post('/addBrand',verifyAccessToken, upload.single('logo'), createBrand)
router.delete('/deleteBrand/:id',verifyAccessToken,deleteBrand)
router.put('/editBrand/:id',verifyAccessToken,upload.single('logo'),editBrand)


//bannerManage
router.post('/banner/add',verifyAccessToken,createBanner)
export default router