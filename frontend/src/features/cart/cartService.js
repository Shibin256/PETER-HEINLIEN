import axiosInstance from "../../api/axiosInstance";

const addToCart = async (data) => {
  const response = await axiosInstance.post("/api/v1/users/cart", data);
  return response.data;
};

const fetchCart = async (userId) => {
  const response = await axiosInstance.get(`/api/v1/users/cart/${userId}`);
  return response.data;
};

const removeFromCart = async (userId, productId, itemQuantity) => {
  const res = await axiosInstance.delete(
    `/api/v1/users/cart/${userId}/${productId}`,
    {
      data: itemQuantity,
    },
  );
  return res.data;
};

const updateCart = async (data) => {
  const response = await axiosInstance.put("/api/v1/users/cart", data);
  return response.data;
};

const toggleIsLocked = async ({ userID, lock }) => {
  console.log("userID:", userID, "lock", lock, "====");
  const response = await axiosInstance.post(
    `/api/v1/users/cart/${userID}/${lock}`,
  );
  return response.data;
};

const wishlistToCart = async (data) => {
  console.log(data, "in slice");
  const response = await axiosInstance.post(
    "/api/v1/users/cart/from-wishlist",
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
