import Brands from "../../model/brandModel.js";
import Category from "../../model/categoryModel.js";
import Product from "../../model/productModel.js";
import wishlistModel from "../../model/wishlistModel.js";
import cloudinary from "../../utils/cloudinary.js";

//creating new product
export const createProduct = async (req, res) => {
    try {
        let available = false
        const { name, description, category, brand, tags, price, quantity } = req.body
        const uploadImage = [];
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
        const { userId } = req.params
        const latestCollection = await Product.find({ isList: { $ne: true } }).sort({ createdAt: -1 }).limit(10)
            .populate('brand')
            .populate('category')
            .select('-createdAt -updatedAt')
            .lean()

        let wishlistProductIds = [];

        if (userId) {
            const wishlist = await wishlistModel.findOne({ userId }).select("productIds");
            wishlistProductIds = wishlist ? wishlist.productIds.map(id => id.toString()) : [];
        }

        const latestWithWishlist = latestCollection.map(product => ({
            ...product,
            isWishlisted: wishlistProductIds.includes(product._id.toString())
        }));

        res.json({ latestCollection: latestWithWishlist });

    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ message: 'Server error fetching products' });
    }
}

export const getTopRatedProduct = async (req, res) => {
    try {
        const { userId } = req.params
        const topRatedCollections = await Product.find({ isList: { $ne: true } }).sort({ averageRating: -1 }).limit(10)
            .populate('brand')
            .populate('category')
            .select('-createdAt -updatedAt')
            .lean()

        let wishlistProductIds = [];

        if (userId) {
            const wishlist = await wishlistModel.findOne({ userId }).select("productIds");
            wishlistProductIds = wishlist ? wishlist.productIds.map(id => id.toString()) : [];
        }

        const latestWithWishlist = topRatedCollections.map(product => ({
            ...product,
            isWishlisted: wishlistProductIds.includes(product._id.toString())
        }));

        res.json({ topRatedCollections: latestWithWishlist });
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ message: 'Server error fetching products' });
    }
}



//fetching all products 
export const getAllProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const categories = req.query.categories?.split(',') || [];
    const brands = req.query.brands?.split(',') || [];
    const sortField = req.query.sort || 'createdAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;

    const filter = { isList: false };

    if (search) filter.name = { $regex: search, $options: 'i' };
    if (categories.length) filter['category'] = { $in: categories };
    if (brands.length) filter['brand'] = { $in: brands };

    try {
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

        let existingImages = [];
        if (req.body.existingImages) {
            if (Array.isArray(req.body.existingImages)) {
                existingImages = req.body.existingImages;
            } else {
                existingImages = [req.body.existingImages];
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
        const category = await Category.find({ isList: { $ne: true } }).select('-createdAt -updatedAt')
        const brands = await Brands.find({ isList: { $ne: true } }).sort({ name: 1 }).select('-createdAt -updatedAt')

        const result = await Product.find({ isList: { $ne: true } }).select('-createdAt -updatedAt')
        res.status(200).json({ category, brands, result })
    } catch (error) {
        console.error('Fetching brand and category  Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const getBrandAndCategory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        const skip = (page - 1) * limit;

        const category = await Category.find({ isList: { $ne: true } }).select('-createdAt -updatedAt')
        const total = await Brands.countDocuments({ isList: { $ne: true } })
        const brands = await Brands.find({ isList: { $ne: true } }).sort({ name: 1 }).select('-createdAt -updatedAt').skip(skip).limit(limit)

        res.status(200).json({
            category,
            brands,
            page,
            totalPages: Math.ceil(total / limit),
        })
    } catch (error) {
        console.error('Fetching brand and category  Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('brand')
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
        const { productId, userId } = req.params
        const currentProduct = await Product.findById(productId)
        if (!currentProduct) return res.status(404).json({ message: 'product not found' });

        const similarProducts = await Product.find({
            _id: { $ne: productId },
            isList: { $ne: true },
            category: currentProduct.category
        }).limit(6).select('-createdAt -updatedAt').lean()

        let wishlistProductIds = [];

        if (userId) {
            const wishlist = await wishlistModel.findOne({ userId }).select("productIds");
            wishlistProductIds = wishlist ? wishlist.productIds.map(id => id.toString()) : [];
        }

        const latestWithWishlist = similarProducts.map(product => ({
            ...product,
            isWishlisted: wishlistProductIds.includes(product._id.toString())
        }));

        res.status(200).json({ similarProducts: latestWithWishlist });
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

        const discountAmount = (product.price * percentage) / 100;
        if (product.offerPrice) {
            if (product.offerPrice > product.price-discountAmount) {
                product.offerPercentage = percentage
                product.offerPrice = product.price - discountAmount;
            } else {
                return res.status(404).json({ message: 'The Category offer is heigher than this offer' });
            }
        } else {
            product.offerPercentage = percentage
            product.offerPrice = product.price - discountAmount;
        }

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
            .select('offerPrice category price offerPercentage')
            .select('-createdAt -updatedAt');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const category = await Category.findById(product.category).select('-createdAt -updatedAt');
        if (category.offerPersentage) {
            const discountAmount = (product.price * category.offerPersentage) / 100;
            console.log(discountAmount,product.price)
            product.offerPrice = product.price - discountAmount
            product.offerPercentage = 0
        } else {
            product.offerPercentage = 0
            product.offerPrice = 0;
        }

        await product.save();
        res.status(200).json({ message: 'Offer removed successfully', product });
    } catch (error) {
        console.error('Error removing offer:', error);
        res.status(500).json({ message: 'Server error while removing offer' });
    }
}