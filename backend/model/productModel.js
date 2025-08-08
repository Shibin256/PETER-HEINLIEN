import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  isList:{type:Boolean,required:true},
  createdAt: { type: Date, default: Date.now }
});


const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: String,
    },
    SKU: {
      type: String,
      unique: true,
      sparse: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    totalQuantity: {
      type: Number,
      default: 0,
    },
    stockStatus: {
      type: String,
      enum: ["In Stock", "Out of Stock", "Preorder"],
      default: "In Stock",
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    rating: {
      type: Number,
      default: 0,
    },
    availability: {
      type: Boolean,
      default: false,
    },
    isList: {
      type: Boolean,
      default: false,
    },
    ratingComment: {
      type: String,
    },
    color: {
      type: String,
    },
    offerPrice: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    numReviews: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 }
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  if (this.totalQuantity === 0) {
    this.stockStatus = "Out of Stock";
    this.availability = false
  } else {
    this.stockStatus = "In Stock";
    this.availability = true
  }
  next();
});


// Export the model
const Product = mongoose.model("Product", productSchema);
export default Product;
