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
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Mark products with this category as isList: true
        const updatedProducts = await Product.updateMany(
            { category: req.params.id },
            { $set: { isList: true } }
        );

        // Mark the category itself as isList: true
        category.isList = true;
        await category.save();

        res.status(200).json({
            message: 'Category and related products marked as isList:true',
            updatedProductCount: updatedProducts.modifiedCount,
        });
    } catch (error) {
        console.error('Error updating category/products:', error);
        res.status(500).json({ message: 'Server error while deleting category' });
    }
};


//Brand deleting section
export const deleteBrand = async (req, res) => {
    try {
        const brand = await Brands.findById(req.params.id)
        if (!brand) return res.status(404).json({ message: 'Brand not found' });

        // Mark products with this category as isList: true
        const updatedProducts = await Product.updateMany(
            { brand: req.params.id },
            { $set: { isList: true } }
        );

        brand.isList = true;
        await brand.save();

        res.status(200).json({
            message: 'Brand and related products deleted successfully',
            deletedProductCount: updatedProducts.modifiedCount,
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


export const editCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        // Check if the category exists
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Update the category name
        category.categoryName = name;
        await category.save();

        res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
        console.error('Edit category Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}



export const addCategoryOffer = async (req, res) => {
    try {
        const { categoryId, percentage } = req.body;

        if (!categoryId || !percentage) {
            return res.status(400).json({ message: 'category ID and percentage are required' });
        }

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'category not found' });
        }
        category.offerPersentage = percentage
        category.offerAdded = true

        category.save()

        const products = await Product.find({ category: categoryId });

        for (let product of products) {
            const discountAmount = (product.price * percentage) / 100;
            console.log(product.offerPrice,product.price,discountAmount)
            if (product.offerPrice && product.offerPrice > product.price - discountAmount) {
                product.offerPrice = product.price - discountAmount;
                await product.save();
            }else{
                 product.offerPrice = product.price - discountAmount;
                await product.save();
            }
        }

        res.status(200).json({ message: 'Offer added successfully' });
    } catch (error) {
        console.error('Error adding offer:', error);
        res.status(500).json({ message: 'Server error while adding offer' });
    }
}



export const removeCategoryOffer = async (req, res) => {
    try {
        const { categoryId } = req.params;
        if (!categoryId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'category not found' });
        }

        const products = await Product.find({ category: categoryId });

        for (let product of products) {
            product.offerPrice = 0;
            await product.save();
        }

        category.offerPersentage = 0
        category.offerAdded = false
        category.save()

        // Remove the offer price
        res.status(200).json({ message: 'Offer removed successfully', products });
    } catch (error) {
        console.error('Error removing offer:', error);
        res.status(500).json({ message: 'Server error while removing offer' });
    }
}