import adminAxiosInstance from "../../api/adminAxiosInstance"
import axiosInstance from "../../api/axiosInstance"

const createCoupons = async (data) => {
    const response = await adminAxiosInstance.post('/api/admin/coupons/createCoupons', data)
    return response.data
}

const fetchAllCoupons = async (search, page, limit) => {
    const params = new URLSearchParams({ page, limit });

    if (search) {
        params.append('search', search);
    }

    const response = await adminAxiosInstance.get('/api/admin/coupons', {
        params: params,
    })
    console.log(response.data, 'servbiece')
    return response.data
}

const deleteCoupon = async (couponId) => {
    const response = await adminAxiosInstance.delete(`/api/admin/coupons/${couponId}`)
    return response.data
}

const updateCoupon = async (data) => {
    const response = await adminAxiosInstance.put(`/api/admin/coupons/${data.couponId}`, {
        code: data.code,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrderAmount: data.minOrderAmount,
        usageLimit: data.usageLimit,
        expirationDate: data.expirationDate
    })
    return response.data
}

const applyCoupon = async ({ userId, couponCode }) => {
    const response = await axiosInstance.post('/api/user/coupons/applyCoupon', {
        userId,
        couponCode
    });
    console.log(response.data, 'in service apply coupon');
    return response.data;
}

const removeCoupon = async (userId,couponId) => {
    console.log(couponId,userId,'in service')
    const response = await axiosInstance.delete(`/api/user/coupons/${couponId}`, {
        data: { userId }, // this is how you pass body in axios DELETE
    });  
    return response.data;
}

const couponsService = {
    createCoupons,
    fetchAllCoupons,
    deleteCoupon,
    applyCoupon,
    updateCoupon,
    removeCoupon
}

export default couponsService