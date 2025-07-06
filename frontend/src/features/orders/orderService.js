import axiosInstance from "../../api/axiosInstance";

const placeOrder = async (orderData) => {
  const response = await axiosInstance.post('/api/user/orders/placeOrder', orderData);
  return response.data;
}

const getOrders = async (userId) => {
  const response = await axiosInstance.get(`/api/user/orders/${userId}`);
  return response.data;
}

const cancelOrderItem = async (data) => {
  const response = await axiosInstance.post(`/api/user/orders/cancelItem`,data);
  return response.data;
}

const cancelVerify=async(itemOrderId)=>{
  const response=await axiosInstance.post(`/api/user/orders/verifyCancel/${itemOrderId}`)
  console.log(response)
  return response.data;
}

const orderService = {
  placeOrder,
  getOrders,
  cancelOrderItem,
  cancelVerify
}

export default orderService;