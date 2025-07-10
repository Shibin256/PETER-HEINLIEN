import express from "express";
import multer from "multer";
import { verifyAccessToken } from "../middleware/authMiddleware.js";
import { deleteUser, getAllUsers, toggleUserBlock } from "../controller/admin/usersController.js";
import { createBrand, createCategory, deleteBrand, deleteCategory, editBrand, editCategory } from "../controller/admin/inventoryController.js";
import { createBanner } from "../controller/admin/bannerController.js";
import { changeOrderStatus, getAllOrders, retrunVerify, verifyCancel } from "../controller/orderController.js";
import { authorizeRole } from "../middleware/authenticateAdmin.js";

const router=express.Router()

const storage=multer.diskStorage({})
const upload=multer({storage})
const roles=['admin']

// user managing
router.get('/users/get',verifyAccessToken,authorizeRole(roles),getAllUsers)
router.patch('/block-toggle/:id',authorizeRole(roles),verifyAccessToken, toggleUserBlock);
router.delete('/delete/:id',authorizeRole(roles),verifyAccessToken,deleteUser)

//category managing
router.post('/addCategory',authorizeRole(roles),verifyAccessToken,createCategory)
router.delete('/deleteCategory/:id',authorizeRole(roles),verifyAccessToken,deleteCategory)
router.put('/editCategory/:id',authorizeRole(roles),verifyAccessToken,editCategory)

//brand managing
router.post('/addBrand',authorizeRole(roles),verifyAccessToken, upload.single('logo'), createBrand)
router.delete('/deleteBrand/:id',authorizeRole(roles),verifyAccessToken,deleteBrand)
router.put('/editBrand/:id',authorizeRole(roles),verifyAccessToken,upload.single('logo'),editBrand)

//bannerManage
router.post('/banner/add',authorizeRole(roles),verifyAccessToken,createBanner)

//orderManage
router.get('/orders/getAllOrders',authorizeRole(roles),verifyAccessToken,getAllOrders)
router.post('/orders/verifyReturn/:itemOrderId',authorizeRole(roles),verifyAccessToken,retrunVerify)
router.post('/orders/verifyCancel/:orderId',authorizeRole(roles),verifyAccessToken,verifyCancel)
router.post('/orders/changeStatus/:orderId',authorizeRole(roles),changeOrderStatus)
export default router