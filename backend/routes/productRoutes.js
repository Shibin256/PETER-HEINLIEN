import express from "express";
import multer from "multer";
import { createProduct, deleteProductById, getAllProducts, getBrandsAndCollection, getCollection, getProductById, updateProduct } from "../controller/admin/productController.js";
import { verifyAccessToken } from "../middleware/authMiddleware.js";

const router=express.Router()

const storage=multer.diskStorage({})
const upload=multer({storage})

router.get('/getCollection',getCollection)
router.post('/add',upload.array("images",4),createProduct)
router.get('/get',getAllProducts)
router.delete('/:id',deleteProductById)
router.put('/update/:id', upload.none(), updateProduct)
router.get('/getBrandsAndCollection',getBrandsAndCollection)
router.get('/:id',getProductById)
export default router