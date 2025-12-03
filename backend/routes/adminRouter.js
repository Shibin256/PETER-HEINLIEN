import express from "express";
import multer from "multer";
import { addProductOffer,removeProductOffer} from "../controller/admin/productController.js";
import { verifyAccessToken } from "../middleware/authMiddleware.js";
import { deleteUser, getAllUsers, toggleUserBlock } from "../controller/admin/usersController.js";
import { addCategoryOffer, createBrand, createCategory, deleteBrand, deleteCategory, editBrand, editCategory, removeCategoryOffer } from "../controller/admin/inventoryController.js";
import { createBanner, deleteBanner, fetchBanners, setActiveBanner } from "../controller/admin/bannerController.js";
import { changeOrderStatus, getAllOrders, retrunVerify, singleCancelVerify, verifyCancel } from "../controller/orderController.js";
import { authorizeRole } from "../middleware/authenticateAdmin.js";
import { createCoupons, deleteCoupon, fetchCoupons, updateCoupon } from "../controller/admin/couponsController.js";
import { downloadSalesReportPDF, exelReport, getBestSellers, getSalesReport } from "../controller/admin/reportController.js";
import { validateCoupon } from "../validators/couponValidator.js";
import { validate } from "../middleware/validationMiddleware.js";
import { validateCategory } from "../validators/categoryValidator.js";
import { validateBrand } from "../validators/brandValidator.js";

const router=express.Router()

const storage=multer.diskStorage({})
const upload=multer({storage})
const roles=['admin']

// user managing
router.get('/users',verifyAccessToken,authorizeRole(roles),getAllUsers)
router.patch('/user/:id/block',authorizeRole(roles),verifyAccessToken, toggleUserBlock);
router.delete('/user/:id',authorizeRole(roles),verifyAccessToken,deleteUser)

//category managing
router.post('/category',authorizeRole(roles),verifyAccessToken,validateCategory,validate,createCategory)
router.delete('/category/:id',authorizeRole(roles),verifyAccessToken,deleteCategory)
router.put('/category/:id',authorizeRole(roles),verifyAccessToken,validateCategory,validate,editCategory)

//brand managing
router.post('/brand',authorizeRole(roles),verifyAccessToken, upload.single('logo'),validateBrand,validate,createBrand)
router.delete('/brand/:id',authorizeRole(roles),verifyAccessToken,deleteBrand)
router.put('/brand/:id',authorizeRole(roles),verifyAccessToken,upload.single('logo'),validateBrand,validate,editBrand)

//bannerManage
router.post('/banner',authorizeRole(roles),upload.array("images",2),verifyAccessToken,createBanner)
router.get('/banner',authorizeRole(roles),verifyAccessToken,fetchBanners)
router.delete('/banner/:bannerId',authorizeRole(roles),verifyAccessToken,deleteBanner)
router.put('/banner/:bannerId',authorizeRole(roles),verifyAccessToken,setActiveBanner)

//orderManage
router.get('/orders',authorizeRole(roles),verifyAccessToken,getAllOrders)
router.post('/orders/:itemOrderId/return',authorizeRole(roles),verifyAccessToken,retrunVerify)
router.post('/orders/:orderId/cancel',authorizeRole(roles),verifyAccessToken,verifyCancel)
router.post('/orders/:orderId/status',authorizeRole(roles),changeOrderStatus)
router.post('/orders/item/:itemOrderId/verify',authorizeRole(roles),verifyAccessToken,singleCancelVerify)



//couponManage
router.post('/coupons',authorizeRole(roles),verifyAccessToken,validateCoupon,validate,createCoupons)
router.get('/coupons',authorizeRole(roles),verifyAccessToken,fetchCoupons)
router.delete('/coupons/:couponId',authorizeRole(roles),verifyAccessToken,deleteCoupon);
router.put('/coupons/:couponId',authorizeRole(roles),verifyAccessToken,updateCoupon);

//offermanage
router.post('/offer',authorizeRole(roles),verifyAccessToken,addCategoryOffer);
router.delete('/offer/:categoryId', authorizeRole(roles), verifyAccessToken,removeCategoryOffer);

//sales report
router.get('/sales/report',authorizeRole(roles),verifyAccessToken,getSalesReport)
router.get("/sales/report/excel", authorizeRole(roles),verifyAccessToken,exelReport);
router.get("/sales/report/pdf",authorizeRole(roles),verifyAccessToken,downloadSalesReportPDF);
router.get('/bestsellers',authorizeRole(roles),verifyAccessToken,getBestSellers)

router.post('/offers',authorizeRole(roles),verifyAccessToken,addProductOffer);
router.delete('/offers/:productId', authorizeRole(roles), verifyAccessToken,removeProductOffer);

export default router