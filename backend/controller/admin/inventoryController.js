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
        }).select('-createdAt -updatedAt');

        if (categoryCheck) return res.status(400).json({ message: 'Category already exists' });

        const newCategory = new Category({
            _id: new mongoose.Types.ObjectId(),
            categoryName: category
        });

        await newCategory.save()

        const categoryResponse = newCategory.toObject();
        delete categoryResponse.createdAt;
        delete categoryResponse.updatedAt;

        res.status(201).json({ message: "Category created", category: categoryResponse })
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

        const result = await cloudinary.uploader.upload(logo.path)

        const brandExists = await Brands.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') }
        }).select('-createdAt -updatedAt -image')

        if (brandExists) return res.status(400).json({ message: 'Brand already exists' });

        const newBrand = new Brands({
            _id: new mongoose.Types.ObjectId(),
            name,
            description,
            image: result.secure_url
        })

        await newBrand.save()

        const brandResponse = newBrand.toObject();
        delete brandResponse.createdAt;
        delete brandResponse.updatedAt;

        res.status(201).json({ message: "brand created", brand: newBrand })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

//Category deleting section
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id).select('_id categoryName isList');

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const updatedProducts = await Product.updateMany(
            { category: req.params.id },
            { $set: { isList: true } }
        );

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
        const brand = await Brands.findById(req.params.id).select('_id categoryName isList')
        if (!brand) return res.status(404).json({ message: 'Brand not found' });

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

        if (logo) {
            const result = await cloudinary.uploader.upload(logo.path);
            updatedData.image = result.secure_url;
        }

        const updatedBrand = await Brands.findByIdAndUpdate(id, updatedData, {
            new: true,
        }).select('-createdAt -updatedAt');

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
        const { category } = req.body;

        const Thecategory = await Category.findById(id).select('-createdAt -updatedAt')
        if (!Thecategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        Thecategory.categoryName = category;
        await Thecategory.save();

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

        const category = await Category.findById(categoryId).select('-createdAt -updatedAt');
        if (!category) {
            return res.status(404).json({ message: 'category not found' });
        }
        category.offerPersentage = percentage
        category.offerAdded = true

        category.save()

        const products = await Product.find({ category: categoryId }).select('-createdAt -updatedAt');

        for (let product of products) {
            const discountAmount = (product.price * percentage) / 100;
            console.log(product.offerPrice, product.price, discountAmount)
            if (product.offerPrice && product.offerPrice > product.price - discountAmount) {
                product.offerPrice = product.price - discountAmount;
                await product.save();
            } else {
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

        const category = await Category.findById(categoryId).select('-createdAt -updatedAt');
        if (!category) {
            return res.status(404).json({ message: 'category not found' });
        }

        const products = await Product.find({ category: categoryId }).select('-createdAt -updatedAt');

        for (let product of products) {
            product.offerPrice = 0;
            await product.save();
        }

        category.offerPersentage = 0
        category.offerAdded = false
        category.save()

        res.status(200).json({ message: 'Offer removed successfully', products });
    } catch (error) {
        console.error('Error removing offer:', error);
        res.status(500).json({ message: 'Server error while removing offer' });
    }
}