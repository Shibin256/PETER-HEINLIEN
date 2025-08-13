import express from "express";
import multer from "multer";
import { addProductOffer, createProduct, deleteProductById, getAllProducts, getBrandAndCategory, getBrandsAndCollection, getCollection, getProductById, getRelatedProducts, removeProductOffer, updateProduct } from "../controller/admin/productController.js";
import { verifyAccessToken } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/authenticateAdmin.js";
import { validateProduct } from "../validators/productValidator.js";
import { validate } from "../middleware/validationMiddleware.js";

const router=express.Router()
const roles=['admin']

const storage=multer.diskStorage({})
const upload=multer({storage})

//products manage
router.get('/products/latest',getCollection)
router.post('/products',authorizeRole(roles),upload.array("images",4),verifyAccessToken,validateProduct,validate,createProduct)
router.get('/products',getAllProducts)
router.delete('/product/:id',authorizeRole(roles),verifyAccessToken,deleteProductById)
router.put('/product/:id',authorizeRole(roles), upload.array("newImages",4),verifyAccessToken, updateProduct)

router.get('/products/getBrandsAndCollection',getBrandsAndCollection)
router.get('/brand/category',getBrandAndCategory)

router.get('/product/:id',getProductById)
router.get('/products/:productId/related',getRelatedProducts)
router.post('/admin/offers',authorizeRole(roles),verifyAccessToken,addProductOffer);
router.delete('/admin/offers/:productId', authorizeRole(roles), verifyAccessToken,removeProductOffer);
export default router