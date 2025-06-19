import Brands from "../../model/brandModel.js";
import Category from "../../model/categoryModel.js";
import Product from "../../model/productModel.js";
import cloudinary from "../../utils/cloudinary.js";

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
        res.status(201).json({ message: "Product created", product: newProduct })


    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export const getAllProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    try {
        const total = await Product.countDocuments();
        console.log(total)
        const products = await Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit)
            .populate('brand') // Populate the brand field with data from the Brands collection
            .populate('category');
        console.log(products.length)
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
}

export const deleteProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if (!product) return res.status(404).json({ message: 'Product not found' });

        await product.deleteOne();
        res.status(200).json({ message: 'Product deleted successfully' });

    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error while deleting product' });
    }
}



export const updateProduct = async (req, res) => {
    try {
        let available = true
        const { id } = req.params
        if (req.body.quantity <= 0) available = false
        const updatedData = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            tags: req.body.tags,
            brand: req.body.brand,
            price: req.body.price,
            totalQuantity: req.body.quantity,
            availability: available
        };


        const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
            new: true,
        });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(updatedProduct);

    } catch (error) {
        console.error('Update Product Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const getBrandsAndCollection = async (req, res) => {
    try {
        const category = await Category.find()
        const brands = await Brands.find().sort({ name: 1 })
        // console.log(category)
        const result = await Product.find()
        res.status(200).json({ category, brands, result})
    } catch (error) {
        console.error('Fetching brand and category  Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}


export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('brand') // Populate the brand field with data from the Brands collection
            .populate('category');

        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error.message);
        res.status(500).json({ message: 'Server error fetching product' });
    }
}
