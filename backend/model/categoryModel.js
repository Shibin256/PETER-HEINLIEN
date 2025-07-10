import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    categoryName: String,
    isList: {
        type: Boolean,
        default: false,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { collection: 'category' })

const Category = mongoose.model('Category', categorySchema);
export default Category;
