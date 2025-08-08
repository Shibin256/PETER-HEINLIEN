import Banners from "../../model/bannerModel.js";
import cloudinary from "../../utils/cloudinary.js";

export const createBanner = async (req, res) => {
    try {
        const { title, description, buttonText, buttonLink } = req.body

        const uploadImage = [];
        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path);
            uploadImage.push(result.secure_url)
        }

        const banner = new Banners({
            title,
            description,
            buttonText,
            bannerImage: uploadImage[0],
            bagroundImage: uploadImage[1]
        });

        await banner.save()

        const bannerResponse = banner.toObject();
        delete bannerResponse.createdAt;
        delete bannerResponse.updatedAt;

        console.log(bannerResponse, '----')
        res.status(201).json({ message: "Banner created", banner: bannerResponse })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}




export const fetchBanners = async (req, res) => {
    try {
        const banners = await Banners.find().sort({ createdAt: -1 });
        console.log(banners, '====')
        res.status(201).json({ message: 'banner fetched', banners });
    } catch (error) {
        console.error('Error fetch banners:', error.message);
        res.status(500).json({ message: 'Server error fetching banners' });

    }
}


export const deleteBanner = async (req, res) => {
    try {
        const bannerId = req.params.bannerId
        console.log(req.params.bannerId)
        await Banners.findByIdAndDelete({ _id: bannerId })
        const banners = await Banners.find().sort({ createdAt: -1 })

        res.status(201).json({ message: 'banner deleted successfully', banners })
    } catch (error) {
        console.error('Error delete banner:', error.message);
        res.status(500).json({ message: 'Server error deleting banner' });
    }
}

export const setActiveBanner = async (req, res) => {
    try {
        const bannerId = req.params.bannerId
        console.log(bannerId)
        await Banners.updateMany({}, { $set: { isActive: false } });

        await Banners.findByIdAndUpdate({ _id: bannerId }, { isActive: true })
        const banners = await Banners.find().sort({ createdAt: -1 })
        res.status(200).json({ message: 'Active banner set', banners})
    } catch (error) {
        console.error('Error toggle active banner:', error.message);
        res.status(500).json({ message: 'Server error toggle active banner' });
    }
}

export const fetchHomeBanner=async(req, res)=>{
    try {
        const banner = await Banners.findOne({ isActive: true }).sort({ createdAt: -1 });
        console.log(banner,'------this is banner')
        res.status(201).json({ message: 'banner fetched', banner });
    } catch (error) {
        console.error('Error fetch banners:', error.message);
        res.status(500).json({ message: 'Server error fetching banners' });
    }
}