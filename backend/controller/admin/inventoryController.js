import mongoose from "mongoose";
import Category from "../../model/categoryModel.js";
import Brands from "../../model/brandModel.js";
import cloudinary from "../../utils/cloudinary.js";

export const createCategory = async (req, res) => {
    try {
        const { category } = req.body
       const categoryCheck = await Category.findOne({
      categoryName: { $regex: new RegExp(`^${category}$`, 'i') }
    });
        if (categoryCheck) return res.status(400).json({ message: 'Category already exists' });

        const newCategory = new Category({
            _id: new mongoose.Types.ObjectId(),
            categoryName: category
        });
        await newCategory.save()
        res.status(201).json({ message: "Category created", category: newCategory })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export const createBrand=async(req,res)=>{
    try {
        const {name,description}=req.body
        const logo=req.file
        console.log(logo)

        const result=await cloudinary.uploader.upload(logo.path)
        const brandExists= await Brands.findOne({
            name:{ $regex: new RegExp(`^${name}$`, 'i') }
        })
        if(brandExists) return res.status(400).json({ message: 'Brand already exists' });
        const newBrand=new Brands({
             _id: new mongoose.Types.ObjectId(),
            name,
            description,
            image:result.secure_url
        })
        await newBrand.save()
        res.status(201).json({ message: "brand created", brand: newBrand })

    } catch (error) {
         console.log(error)
        res.status(500).json({ error: error.message })
    } 
}