import Coupons from "../../model/couponsModal.js"

export const createCoupons = async (req, res) => {
    try {
        const {
            couponCode,
            discountType,
            discountAmount,
            minPurchase,
            usageLimit,
            expirationDate,
        } = req.body;

        console.log(expirationDate);

        // Await is missing here
        const existingCoupon = await Coupons.findOne({ code: couponCode }).select('-password -createdAt -updatedAt');
        if (existingCoupon) {
            return res.status(400).json({ message: 'A coupon with this code already exists' });
        }

        // Use correct field names as per your schema
        const newCoupon = new Coupons({
            code: couponCode,
            discountType,
            discountValue: discountAmount,
            minOrderAmount: minPurchase,
            usageLimit,
            expiresAt: expirationDate,
        });

        await newCoupon.save();

        // Missing await
        const allCoupons = await Coupons.find();
        res.status(201).json({ message: "Coupon created", coupons: allCoupons });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


export const fetchCoupons = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    const { search } = req.query;

    const filter = {}

    if (search) filter.code = { $regex: search, $options: 'i' };


    let coupons = await Coupons.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select('-createdAt -updatedAt');
    let total = await Coupons.countDocuments(filter)


    res.json({
        coupons,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    });
}


export const fetchAdsCoupons = async (req, res) => {
    let coupon = await Coupons.findOne()
        .sort({ createdAt: -1 })
        .select('-createdAt -updatedAt');
    res.json({ coupon });
}

export const deleteCoupon = async (req, res) => {
    const { couponId } = req.params;

    try {
        const deletedCoupon = await Coupons.findByIdAndDelete(couponId).select('-createdAt -updatedAt');
        if (!deletedCoupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        res.status(200).json({ message: 'Coupon deleted successfully', coupon: deletedCoupon });
    } catch (error) {
        console.error('Error deleting coupon:', error);
        res.status(500).json({ message: 'Server error while deleting coupon' });
    }
}


export const updateCoupon = async (req, res) => {
    const { couponId } = req.params;
    const {
        code,
        discountType,
        discountValue,
        minOrderAmount,
        usageLimit,
        expirationDate
    } = req.body;

    try {
        const updatedCoupon = await Coupons.findByIdAndUpdate(couponId, {
            code,
            discountType,
            discountValue,
            minOrderAmount,
            usageLimit,
            expiresAt: expirationDate
        }, { new: true });
        if (!updatedCoupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        return res.status(200).json({ message: 'Coupon updated successfully', coupon: updatedCoupon });
    } catch (error) {
        console.error('Error updating coupon:', error);
        return res.status(500).json({ message: 'Server error while updating coupon' });
    }
}


export const applyCoupon = async (req, res) => {
    const { userId, couponCode } = req.body;
    try {
        const coupon = await Coupons.findOne({ code: couponCode }).select('-createdAt -updatedAt');

        console.log(coupon, 'coupon');
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        if (coupon.usageLimit <= 0) {
            return res.status(400).json({ message: 'Coupon usage limit exceeded' });
        }
        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
            return res.status(400).json({ message: 'Coupon has expired' });
        }
        if ((coupon.usersUsed || []).some(user => user.toString() === userId)) {
            return res.status(400).json({ message: 'You have already used this coupon' });
        }
        console.log('Coupon is valid, applying discount');

        // Decrease the usage limit
        coupon.usageLimit -= 1;
        coupon.usersUsed.push(userId);
        await coupon.save();
        res.status(200).json({ message: 'Coupon applied successfully', coupon });
    } catch (error) {
        console.error('Error applying coupon:', error);
        res.status(500).json({ message: 'Server error while applying coupon' });
    }
}



export const removeCoupon = async (req, res) => {
    const { couponId } = req.params;
    const { userId } = req.body; // Make sure userId is sent in the request body

    try {
        const coupon = await Coupons.findOne({ code: couponId }).select('-createdAt -updatedAt');
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        // Remove the user from usersUsed array if they exist
        coupon.usersUsed = coupon.usersUsed.filter(id => id.toString() !== userId);

        coupon.usageLimit += 1;

        await coupon.save();

        res.status(200).json({ message: 'User removed from coupon successfully', coupon });
    } catch (error) {
        console.error('Error removing user from coupon:', error);
        res.status(500).json({ message: 'Server error while removing user from coupon' });
    }
};
