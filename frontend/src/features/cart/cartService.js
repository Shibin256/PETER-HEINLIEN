import axiosInstance from "../../api/axiosInstance";

const addToCart = async (data) => {
  const response = await axiosInstance.post('/api/user/cart/add', data);
  return response.data;
};

const fetchCart = async (userId) => {
  const response = await axiosInstance.get(`/api/user/cart/${userId}`);
  return response.data;
};

const removeFromCart=async(userId,productId)=>{
    const res=await axiosInstance.delete(`/api/user/cart/${userId}/${productId}`)
    return res.data
};

const updateCart = async (data) => {
  const response = await axiosInstance.put('/api/user/cart/update', data);
  return response.data;
};

const cartService = {
  addToCart,
  fetchCart,
  removeFromCart,
  updateCart

};

export default cartService;