import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  bannerImage: {
    type: String,
    required: true, // URL or path to the image stored on Cloudinary or server
  },
  bagroundImage:{
    type:String,
    required:true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  buttonText: {
    type: String,
    required: true,
    trim: true
  },
  buttonLink: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const Banners= mongoose.model('Banner', bannerSchema);
export default Banners
