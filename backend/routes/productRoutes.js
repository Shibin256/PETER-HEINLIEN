import express from "express";
import multer from "multer";
import { createProduct, deleteProductById, getAllProducts, getBrandsAndCollection, getCollection, getProductById, updateProduct } from "../controller/admin/productController.js";
import { verifyAccessToken } from "../middleware/authMiddleware.js";

const router=express.Router()

const storage=multer.diskStorage({})
const upload=multer({storage})

//products manage
router.get('/getCollection',verifyAccessToken,getCollection)
router.post('/add',upload.array("images",4),verifyAccessToken,createProduct)
router.get('/get',verifyAccessToken,getAllProducts)
router.delete('/:id',verifyAccessToken,deleteProductById)
router.put('/update/:id', upload.none(),verifyAccessToken, updateProduct)

router.get('/getBrandsAndCollection',verifyAccessToken,getBrandsAndCollection)
router.get('/:id',verifyAccessToken,getProductById)
export default router