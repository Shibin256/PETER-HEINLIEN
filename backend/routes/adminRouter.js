import express from "express";
import multer from "multer";
import { verifyAccessToken } from "../middleware/authMiddleware.js";
import { deleteUser, getAllUsers, toggleUserBlock } from "../controller/admin/usersController.js";
import { addCategoryOffer, createBrand, createCategory, deleteBrand, deleteCategory, editBrand, editCategory, removeCategoryOffer } from "../controller/admin/inventoryController.js";
import { createBanner, deleteBanner, fetchBanners, setActiveBanner } from "../controller/admin/bannerController.js";
import { changeOrderStatus, getAllOrders, retrunVerify, singleCancelVerify, verifyCancel } from "../controller/orderController.js";
import { authorizeRole } from "../middleware/authenticateAdmin.js";
import { createCoupons, deleteCoupon, fetchCoupons, updateCoupon } from "../controller/admin/couponsController.js";
import { downloadSalesReportPDF, exelReport, getBestSellers, getSalesReport } from "../controller/admin/reportController.js";

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
router.post('/banner/add',authorizeRole(roles),upload.array("images",2),verifyAccessToken,createBanner)
router.get('/banner/fetchBanners',authorizeRole(roles),verifyAccessToken,fetchBanners)
router.delete('/banner/deleteBanner/:bannerId',authorizeRole(roles),verifyAccessToken,deleteBanner)
router.put('/banner/setActiveBanner/:bannerId',authorizeRole(roles),verifyAccessToken,setActiveBanner)

//orderManage
router.get('/orders/getAllOrders',authorizeRole(roles),verifyAccessToken,getAllOrders)
router.post('/orders/verifyReturn/:itemOrderId',authorizeRole(roles),verifyAccessToken,retrunVerify)
router.post('/orders/verifyCancel/:orderId',authorizeRole(roles),verifyAccessToken,verifyCancel)
router.post('/orders/changeStatus/:orderId',authorizeRole(roles),changeOrderStatus)
router.post('/orders/singleCancelVerify/:itemOrderId',authorizeRole(roles),verifyAccessToken,singleCancelVerify)



//couponManage
router.post('/coupons/createCoupons',authorizeRole(roles),verifyAccessToken,createCoupons)
router.get('/coupons',authorizeRole(roles),verifyAccessToken,fetchCoupons)
router.delete('/coupons/:couponId',authorizeRole(roles),verifyAccessToken,deleteCoupon);
router.put('/coupons/:couponId',authorizeRole(roles),verifyAccessToken,updateCoupon);

//offermanage

router.post('/addOffer',authorizeRole(roles),verifyAccessToken,addCategoryOffer);
router.delete('/removeOffer/:categoryId', authorizeRole(roles), verifyAccessToken,removeCategoryOffer);

//sales report
router.get('/dashboard/sales-report',authorizeRole(roles),verifyAccessToken,getSalesReport)
router.get("/dashboard/sales-report/excel", authorizeRole(roles),verifyAccessToken,exelReport);
router.get("/dashboard/sales-report/pdf",authorizeRole(roles),verifyAccessToken,downloadSalesReportPDF);
router.get('/dashboard/best-sellers',authorizeRole(roles),verifyAccessToken,getBestSellers)



export default router