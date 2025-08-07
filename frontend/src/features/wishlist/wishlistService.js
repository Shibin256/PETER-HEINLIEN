import axiosInstance from "../../api/axiosInstance";

const addToWishlist = async (data) => {
  const response = await axiosInstance.post("/api/v1/users/wishlist", data);
  return response.data;
};

const getWishlist = async (userId) => {
  const response = await axiosInstance.get(`/api/v1/users/wishlist/${userId}`);
  return response.data;
};

const getWishedProduct = async ({ userId, productId }) => {
  const response = await axiosInstance.get(
    `/api/v1/users/wishlist/${userId}/${productId}`,
  );
  return response.data;
};

const removeFromWishlist = async (data) => {
  const response = await axiosInstance.post("/api/v1/users/wishlist/remove", data);
  return response.data;
};

const wishlistService = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  getWishedProduct,
};

export default wishlistService;
