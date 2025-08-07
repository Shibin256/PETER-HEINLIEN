import adminAxiosInstance from "../../api/adminAxiosInstance";
import axiosInstance from "../../api/axiosInstance";

const createCoupons = async (data) => {
  const response = await adminAxiosInstance.post(
    "/api/v1/admin/coupons",
    data,
  );
  return response.data;
};

const fetchAllCoupons = async (search, page, limit) => {
  const params = new URLSearchParams({ page, limit });

  if (search) {
    params.append("search", search);
  }

  const response = await adminAxiosInstance.get("/api/v1/admin/coupons", {
    params: params,
  });
  return response.data;
};


const fetchAdsCoupons= async () => {
  const response = await axiosInstance.get("/api/v1/users/coupons");
  return response.data;
};

const deleteCoupon = async (couponId) => {
  const response = await adminAxiosInstance.delete(
    `/api/v1/admin/coupons/${couponId}`,
  );
  return response.data;
};

const updateCoupon = async (data) => {
  console.log(data)
  const response = await adminAxiosInstance.put(
    `/api/v1/admin/coupons/${data.couponId}`,
    {
      code: data.couponCode,
      discountType: data.discountType,
      discountValue: data.discountAmount,
      minOrderAmount: data.minPurchase,
      usageLimit: data.usageLimit,
      expirationDate: data.expirationDate,
    },
  );
  return response.data;
};

const applyCoupon = async ({ userId, couponCode }) => {
  const response = await axiosInstance.post("/api/v1/users/coupons", {
    userId,
    couponCode,
  });
  console.log(response.data, "in service apply coupon");
  return response.data;
};

const removeCoupon = async (userId, couponId) => {
  console.log(couponId, userId, "in service");
  const response = await axiosInstance.delete(`/api/v1/users/coupons/${couponId}`, {
    data: { userId }, // this is how you pass body in axios DELETE
  });
  return response.data;
};

const couponsService = {
  createCoupons,
  fetchAllCoupons,
  deleteCoupon,
  applyCoupon,
  updateCoupon,
  removeCoupon,
  fetchAdsCoupons
};

export default couponsService;
