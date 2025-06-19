import mongoose from "mongoose";

const brandSchema=new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: Date,
  name: String,
  description: String,
  image: [String]
},{ collection: 'brands' })



const Brands=mongoose.model('Brand', brandSchema);
export default Brands;
