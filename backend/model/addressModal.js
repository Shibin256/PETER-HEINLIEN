import mongoose from "mongoose";

const addressSchema=new mongoose.Schema(
    {
        _id:mongoose.Schema.Types.ObjectId,
        name:{
            type:String,
            required:true,
            trim: true,
        },
        house:{
            type:String,
            required:true,
        },
        locality:{
            type:String,
            required:true,
        },
         city:{
            type:String,
            required:true,
        }, 
        state:{
            type:String,
            required:true,
        },
        pincode:{
            type:Number,
            required:true
        },
        phone:{
            type:Number,
            required:true
        },
        alternativePhone:{
            type:Number,
            required:false
        },
        addressType:{
            type:String,
            required:true,
        },
        defaultAddress:{
            type:Boolean,
            default:false
        }
    },
    {
        timestamps:true,
    }
)

const Address=mongoose.model('Address',addressSchema); 
export default Address;