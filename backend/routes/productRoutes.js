import express from "express";
import multer from "multer";
import { createProduct } from "../controller/admin/productController.js";

const router=express.Router()

const storage=multer.diskStorage({})
const upload=multer({storage})

router.post('/add',upload.array("images",4),createProduct)

export default router