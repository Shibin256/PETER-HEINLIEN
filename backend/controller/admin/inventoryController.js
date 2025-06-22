import mongoose from "mongoose";
import Category from "../../model/categoryModel.js";
import Brands from "../../model/brandModel.js";
import cloudinary from "../../utils/cloudinary.js";
import Product from "../../model/productModel.js";

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

export const createBrand = async (req, res) => {
    try {
        const { name, description } = req.body
        const logo = req.file
        console.log(logo)

        const result = await cloudinary.uploader.upload(logo.path)
        const brandExists = await Brands.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') }
        })
        if (brandExists) return res.status(400).json({ message: 'Brand already exists' });
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

export const deleteCategory = async (req, res) => {
    try {
        console.log(req.params.id)
        const category = await Category.findById(req.params.id)
        const prdoucts = await Product.find({ category: req.params.id })
        if (!category) return res.status(404).json({ message: 'Category not found' });

        const deletedProducts = await Product.deleteMany({ category: req.params.id });
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

export const deleteBrand=async(req,res)=>{
    try {
        console.log(req.params.id)
        const brand = await Brands.findById(req.params.id)
        const prdoucts = await Product.find({ brand: req.params.id })
        console.log(brand, '--------------------', prdoucts)
        if (!brand) return res.status(404).json({ message: 'Brand not found' });

        const deletedProducts = await Product.deleteMany({ brand: req.params.id });
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
