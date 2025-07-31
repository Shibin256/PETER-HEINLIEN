import Brands from "../../model/brandModel.js";
import Category from "../../model/categoryModel.js";
import Product from "../../model/productModel.js";
import cloudinary from "../../utils/cloudinary.js";

//creating new product
export const createProduct = async (req, res) => {
    try {
        let available = false
        const { name, description, category, brand, tags, price, quantity } = req.body
        //variable to save the images 
        const uploadImage = [];
        //one by one uploading to cloudinary
        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path);
            uploadImage.push(result.secure_url)
        }

        if (quantity > 0) available = true

        const newProduct = new Product({
            name,
            description,
            brand,
            category,
            tags: tags,
            price,
            images: uploadImage,
            availability: available,
            totalQuantity: quantity
        });


        await newProduct.save()

        const productResponse = newProduct.toObject();
        delete productResponse.createdAt;
        delete productResponse.updatedAt;

        res.status(201).json({ message: "Product created", product: productResponse })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

//fetch latest collection for home page
export const getCollection = async (req, res) => {
    try {
        const latestCollection = await Product.find({isList: { $ne: true }}).sort({ createdAt: -1 }).limit(10)
            .populate('brand') // Populate the brand field with data from the Brands collection
            .populate('category')
            .select('-createdAt -updatedAt');

        res.json({ latestCollection });
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ message: 'Server error fetching products' });
    }
}

//fetching all products with pagination
export const getAllProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    // filter oprtions variables
    const categories = req.query.categories?.split(',') || [];
    const brands = req.query.brands?.split(',') || [];
    const sortField = req.query.sort || 'createdAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;

    const filter = {isList: false };

    if (search) filter.name = { $regex: search, $options: 'i' };
    if (categories.length) filter['category'] = { $in: categories };
    if (brands.length) filter['brand'] = { $in: brands };

    try {
        // getting the number of total products
        const total = await Product.countDocuments(filter);

        const products = await Product.find({
            ...filter,
            isList: { $ne: true },
        })
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(limit)
            .populate('brand')
            .populate('category')
            .select('-createdAt -updatedAt');

        res.json({
            products,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ message: 'Server error fetching products' });
    }
};


//product deleting section
export const deleteProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).select('_id isList')

        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.isList = true;
        await product.save();
        res.status(200).json({ message: 'Product deleted successfully' });

    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error while deleting product' });
    }
}


// product updating section
export const updateProduct = async (req, res) => {
    try {
        let available = true
        const { id } = req.params

        if (req.body.quantity <= 0) available = false

        // Step 1: Handle existing image URLs sent from frontend
        let existingImages = [];
        if (req.body.existingImages) {
            if (Array.isArray(req.body.existingImages)) {
                existingImages = req.body.existingImages;
            } else {
                existingImages = [req.body.existingImages]; // if only one string was sent
            }
        }


        const uploadImage = []

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path);
                uploadImage.push(result.secure_url);
            }
        }


        const finalImages = [...existingImages, ...uploadImage];

        const updatedData = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            tags: req.body.tags,
            brand: req.body.brand,
            price: req.body.price,
            totalQuantity: req.body.quantity,
            availability: available,
            images: finalImages
        };

        const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
            new: true,
        }).select('-createdAt -updatedAt');

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(updatedProduct);

    } catch (error) {
        console.error('Update Product Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}


//get all brands and collection form db
export const getBrandsAndCollection = async (req, res) => {
    try {
        const category = await Category.find({isList: { $ne: true }}).select('-createdAt -updatedAt')
        const brands = await Brands.find({isList: { $ne: true }}).sort({ name: 1 }).select('-createdAt -updatedAt')

        const result = await Product.find({isList: { $ne: true }}).select('-createdAt -updatedAt')
        res.status(200).json({ category, brands, result })
    } catch (error) {
        console.error('Fetching brand and category  Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

//get products by its Id with brands and category
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('brand') // Populate the brand field with data from the Brands collection
            .populate('category')
            .select('-createdAt -updatedAt');

        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error.message);
        res.status(500).json({ message: 'Server error fetching product' });
    }
}


export const getRelatedProducts = async (req, res) => {
    try {
        const { productId } = req.params
        console.log(productId)
        const currentProduct = await Product.findById(productId)
        if (!currentProduct) return res.status(404).json({ message: 'product not found' });

        const similarProducts = await Product.find({
            _id: { $ne: productId },
            isList: { $ne: true} ,
            category: currentProduct.category
        }).limit(6).select('-createdAt -updatedAt')

        res.status(200).json(similarProducts);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error });
    }
}

export const addProductOffer = async (req, res) => {
    try {
        const { productId, percentage } = req.body;

        if (!productId || !percentage) {
            return res.status(400).json({ message: 'Product ID and percentage are required' });
        }

        const product = await Product.findById(productId).select('-createdAt -updatedAt');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Calculate the offer price based on the percentage
        const discountAmount = (product.price * percentage) / 100;
        product.offerPrice = product.price - discountAmount;

        await product.save();

        res.status(200).json({ message: 'Offer added successfully', product });
    } catch (error) {
        console.error('Error adding offer:', error);
        res.status(500).json({ message: 'Server error while adding offer' });
    }
}   



export const removeProductOffer = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }
        const product = await Product
            .findById(productId)
            .select('offerPrice')
            .select('-createdAt -updatedAt'); // Select only the offerPrice field
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Remove the offer price
        product.offerPrice = 0;
        await product.save();
        res.status(200).json({ message: 'Offer removed successfully', product });
    } catch (error) {
        console.error('Error removing offer:', error);
        res.status(500).json({ message: 'Server error while removing offer' });
    }
}