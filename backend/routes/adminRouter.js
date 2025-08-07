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
router.get('/admin/users',verifyAccessToken,authorizeRole(roles),getAllUsers)
router.patch('/admin/user/:id/block',authorizeRole(roles),verifyAccessToken, toggleUserBlock);
router.delete('/admin/user/:id',authorizeRole(roles),verifyAccessToken,deleteUser)

//category managing
router.post('/admin/category',authorizeRole(roles),verifyAccessToken,createCategory)
router.delete('/admin/category/:id',authorizeRole(roles),verifyAccessToken,deleteCategory)
router.put('/admin/category/:id',authorizeRole(roles),verifyAccessToken,editCategory)

//brand managing
router.post('/admin/brand',authorizeRole(roles),verifyAccessToken, upload.single('logo'), createBrand)
router.delete('/admin/brand/:id',authorizeRole(roles),verifyAccessToken,deleteBrand)
router.put('/admin/brand/:id',authorizeRole(roles),verifyAccessToken,upload.single('logo'),editBrand)

//bannerManage
router.post('/admin/banner',authorizeRole(roles),upload.array("images",2),verifyAccessToken,createBanner)
router.get('/admin/banner',authorizeRole(roles),verifyAccessToken,fetchBanners)
router.delete('/admin/banner/:bannerId',authorizeRole(roles),verifyAccessToken,deleteBanner)
router.put('/admin/banner/:bannerId',authorizeRole(roles),verifyAccessToken,setActiveBanner)

//orderManage
router.get('/admin/orders',authorizeRole(roles),verifyAccessToken,getAllOrders)
router.post('/admin/orders/:itemOrderId/return',authorizeRole(roles),verifyAccessToken,retrunVerify)
router.post('/admin/orders/:orderId/cancel',authorizeRole(roles),verifyAccessToken,verifyCancel)
router.post('/admin/orders/:orderId/status',authorizeRole(roles),changeOrderStatus)
router.post('/admin/orders/item/:itemOrderId/verify',authorizeRole(roles),verifyAccessToken,singleCancelVerify)



//couponManage
router.post('/admin/coupons',authorizeRole(roles),verifyAccessToken,createCoupons)
router.get('/admin/coupons',authorizeRole(roles),verifyAccessToken,fetchCoupons)
router.delete('/admin/coupons/:couponId',authorizeRole(roles),verifyAccessToken,deleteCoupon);
router.put('/admin/coupons/:couponId',authorizeRole(roles),verifyAccessToken,updateCoupon);

//offermanage
router.post('/admin/offer',authorizeRole(roles),verifyAccessToken,addCategoryOffer);
router.delete('/admin/offer/:categoryId', authorizeRole(roles), verifyAccessToken,removeCategoryOffer);

//sales report
router.get('/admin/sales/report',authorizeRole(roles),verifyAccessToken,getSalesReport)
router.get("/admin/sales/report/excel", authorizeRole(roles),verifyAccessToken,exelReport);
router.get("/admin/sales/report/pdf",authorizeRole(roles),verifyAccessToken,downloadSalesReportPDF);
router.get('/admin/bestsellers',authorizeRole(roles),verifyAccessToken,getBestSellers)

export default router