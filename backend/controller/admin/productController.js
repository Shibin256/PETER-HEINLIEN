import productSchema from "../../model/productModel.js";
import cloudinary from "../../utils/cloudinary.js";

export const createProduct = async (req, res) => {
    try {
        const { name, description, category, brand, tags, price } = req.body
        const uploadImage = [];
        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path);
            uploadImage.push(result.secure_url)
        }

        const newProduct = new productSchema({
            name,
            description,
            // brand,
            // category,
            Tag: tags,
            price,
            images: uploadImage,
        });


        await newProduct.save()
        res.status(201).json({ message: "Product created", product: newProduct })


    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}