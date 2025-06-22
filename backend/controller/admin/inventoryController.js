import mongoose from "mongoose";
import Category from "../../model/categoryModel.js";
import Brands from "../../model/brandModel.js";
import cloudinary from "../../utils/cloudinary.js";
import Product from "../../model/productModel.js";

//create categroy section
export const createCategory = async (req, res) => {
    try {
        const { category } = req.body
        const categoryCheck = await Category.findOne({
            categoryName: { $regex: new RegExp(`^${category}$`, 'i') }
        });

        if (categoryCheck) return res.status(400).json({ message: 'Category already exists' });
        
        //creating new category with a objectId
        const newCategory = new Category({
            _id: new mongoose.Types.ObjectId(),
            categoryName: category
        });
        //saving category
        await newCategory.save()
        res.status(201).json({ message: "Category created", category: newCategory })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

//create brand section
export const createBrand = async (req, res) => {
    try {
        const { name, description } = req.body
        const logo = req.file

        //uploads the image to cloudinary
        const result = await cloudinary.uploader.upload(logo.path)

        const brandExists = await Brands.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') }
        })

        if (brandExists) return res.status(400).json({ message: 'Brand already exists' });

        //creating new brand with a objectId
        const newBrand = new Brands({
            _id: new mongoose.Types.ObjectId(),
            name,
            description,
            image: result.secure_url
        })

        await newBrand.save()
        res.status(201).json({ message: "brand created", brand: newBrand })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

//Category deleting section
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
        //finding products respected with the category to delete
        const prdoucts = await Product.find({ category: req.params.id })

        if (!category) return res.status(404).json({ message: 'Category not found' });
        //deleting products that with the category
        const deletedProducts = await Product.deleteMany({ category: req.params.id });
        //delete category
        await category.deleteOne();

        res.status(200).json({
            message: 'Category and related products deleted successfully',
            deletedProductCount: deletedProducts.deletedCount,
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Server error while deleting category' });
    }
}

//Brand deleting section
export const deleteBrand=async(req,res)=>{
    try {
        const brand = await Brands.findById(req.params.id)
        //finding products respected with the Brand to delete
        const prdoucts = await Product.find({ brand: req.params.id })

        if (!brand) return res.status(404).json({ message: 'Brand not found' });

        //deleting products that with the brand
        const deletedProducts = await Product.deleteMany({ brand: req.params.id });
        //delete brand
        await brand.deleteOne();

        res.status(200).json({
            message: 'Brand and related products deleted successfully',
            deletedProductCount: deletedProducts.deletedCount,
        });
    } catch (error) {
          console.error('Error deleting brand:', error);
        res.status(500).json({ message: 'Server error while deleting brand' });
    }
}

export const editBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const logo = req.file;

    const updatedData = {
      name: req.body.name,
      description: req.body.description,
    };

    // If a new logo is uploaded, upload to Cloudinary
    if (logo) {
      const result = await cloudinary.uploader.upload(logo.path);
      updatedData.image = result.secure_url;
    }

    //updating brand
    const updatedBrand = await Brands.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedBrand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.status(200).json(updatedBrand);
  } catch (error) {
    console.error('Edit brand Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
