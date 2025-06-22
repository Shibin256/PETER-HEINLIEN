import axiosInstance from "../../api/axiosInstance";

const addToWishlist = async (data) => {
  const response = await axiosInstance.post('/api/user/wishlist/add', data);
  return response.data;
};

const getWishlist = async (userId) => {
  const response = await axiosInstance.get(`/api/user/wishlist/${userId}`);
  return response.data;
};
 

const getWishedProduct = async ({userId,productId}) => {
  const response = await axiosInstance.get(`/api/user/wishlist/check/${userId}/${productId}`);
  console.log(response.data)
  return response.data;
};

const removeFromWishlist = async (data) => {
  const response = await axiosInstance.post('/api/user/wishlist/remove',data);
  return response.data;
};


const wishlistService = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  getWishedProduct
};

export default wishlistService;
