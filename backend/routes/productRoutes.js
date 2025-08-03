import express from "express";
import multer from "multer";
import { addProductOffer, createProduct, deleteProductById, getAllProducts, getBrandAndCategory, getBrandsAndCollection, getCollection, getProductById, getRelatedProducts, removeProductOffer, updateProduct } from "../controller/admin/productController.js";
import { verifyAccessToken } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/authenticateAdmin.js";

const router=express.Router()
const roles=['admin']

const storage=multer.diskStorage({})
const upload=multer({storage})

//products manage
router.get('/getCollection',getCollection)
router.post('/add',authorizeRole(roles),upload.array("images",4),verifyAccessToken,createProduct)
router.get('/get',getAllProducts)
router.delete('/:id',authorizeRole(roles),verifyAccessToken,deleteProductById)
router.put('/update/:id',authorizeRole(roles), upload.array("newImages",4),verifyAccessToken, updateProduct)

router.get('/getBrandsAndCollection',getBrandsAndCollection)
router.get('/getBrandAndCategory',getBrandAndCategory)

router.get('/:id',getProductById)
router.get('/relatedProducts/:productId',getRelatedProducts)
router.post('/addOffer',authorizeRole(roles),verifyAccessToken,addProductOffer);
router.delete('/removeOffer/:productId', authorizeRole(roles), verifyAccessToken,removeProductOffer);
export default router