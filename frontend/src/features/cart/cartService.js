import axiosInstance from "../../api/axiosInstance";

const addToCart = async (data) => {
  const response = await axiosInstance.post("/api/user/cart/add", data);
  return response.data;
};

const fetchCart = async (userId) => {
  const response = await axiosInstance.get(`/api/user/cart/${userId}`);
  return response.data;
};

const removeFromCart = async (userId, productId, itemQuantity) => {
  const res = await axiosInstance.delete(
    `/api/user/cart/${userId}/${productId}`,
    {
      data: itemQuantity,
    },
  );
  return res.data;
};

const updateCart = async (data) => {
  const response = await axiosInstance.put("/api/user/cart/update", data);
  return response.data;
};

const toggleIsLocked = async ({ userID, lock }) => {
  console.log("userID:", userID, "lock", lock, "====");
  const response = await axiosInstance.post(
    `/api/user/cart/toggleIsLocked/${userID}/${lock}`,
  );
  return response.data;
};

const wishlistToCart = async (data) => {
  console.log(data, "in slice");
  const response = await axiosInstance.post(
    "/api/user/cart/wishlistToCart",
    data,
  );
  return response.data;
};

const cartService = {
  addToCart,
  fetchCart,
  removeFromCart,
  updateCart,
  wishlistToCart,
  toggleIsLocked,
};

export default cartService;
