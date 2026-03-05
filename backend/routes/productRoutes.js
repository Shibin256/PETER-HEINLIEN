import express from "express";
import multer from "multer";
import {createProduct, deleteProductById, getAllProducts, getAllProductsAdmin, getBrandAndCategory, getBrandsAndCollection, getCollection, getProductById, getRelatedProducts, getTopRatedProduct, listProduct, unlistProduct, updateProduct } from "../controller/admin/productController.js";
import { verifyAccessToken } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/authenticateAdmin.js";
import { validateProduct } from "../validators/productValidator.js";
import { validate } from "../middleware/validationMiddleware.js";

const router=express.Router()
const roles=['admin']

const storage=multer.diskStorage({})
const upload=multer({storage})

// //products manage
// router.get('/products/latest/:userId',getCollection)
// router.get('/products/latest',getCollection)
// router.get('/products/top-rated/:userId',getTopRatedProduct)
// router.get('/products/top-rated',getTopRatedProduct)

// In productRoutes.js — replace the four lines with these:
router.get('/products/latest', getCollection);
router.get('/products/latest/:userId', getCollection);
router.get('/products/top-rated', getTopRatedProduct);
router.get('/products/top-rated/:userId', getTopRatedProduct);

router.post('/products',authorizeRole(roles),upload.array("images",4),verifyAccessToken,validateProduct,validate,createProduct)
router.get('/products',authorizeRole(roles),verifyAccessToken,getAllProductsAdmin)
router.get('/products/user',verifyAccessToken,getAllProducts)
router.delete('/product/:id',authorizeRole(roles),verifyAccessToken,deleteProductById)

router.post('/product/unlist/:id',authorizeRole(roles),verifyAccessToken,unlistProduct)

router.post('/product/:id',authorizeRole(roles),verifyAccessToken,listProduct)

router.put('/product/:id',authorizeRole(roles), upload.array("newImages",4),verifyAccessToken,validateProduct,validate, updateProduct)

router.get('/products/getBrandsAndCollection',getBrandsAndCollection)
router.get('/brand/category',getBrandAndCategory)

router.get('/product/:id',getProductById)
router.get('/products/:productId/related', getRelatedProducts)
router.get('/products/:productId/:userId/related',getRelatedProducts)
// router.post('/offers',authorizeRole(roles),verifyAccessToken,addProductOffer);
// router.delete('/offers/:productId', authorizeRole(roles), verifyAccessToken,removeProductOffer);
export default router