import adminAxiosInstance from "../../api/adminAxiosInstance";
import axiosInstance from "../../api/axiosInstance";

const placeOrder = async (orderData) => {
  const response = await axiosInstance.post(
    "/api/v1/users/orders",
    orderData,
  );
  return response.data;
};

const getOrders = async (userId, search, page, limit) => {
  const params = new URLSearchParams({ page, limit });
  if (search) {
    params.append("search", search);
  }

  const response = await axiosInstance.get(`/api/v1/users/orders/${userId}`, {
    params: params,
  });

  return response.data;
};

const cancelOrderItem = async (data) => {
  const response = await axiosInstance.post(
    `/api/v1/users/orders/cancel`,
    data,
  );
  return response.data;
};

const cancelSingleOrderItem = async (data) => {
  const response = await axiosInstance.post(
    `/api/v1/users/orders/item/cancel`,
    data,
  );
  return response.data;
};

const cancelVerify = async (itemOrderId) => {
  const response = await adminAxiosInstance.post(
    `/api/v1/admin/orders/${itemOrderId}/cancel`,
  );
  return response.data;
};

const changeOrderStatus = async ({ itemOrderId, data }) => {
  const response = await adminAxiosInstance.post(
    `/api/v1/admin/orders/${itemOrderId}/status`,
    data,
  );
  return response.data;
};

const getALlOrders = async (search, page, limit, sort) => {
  const params = new URLSearchParams({ page, limit });
  if (search) {
    params.append("search", search);
  }
  if (sort) {
    params.append("sort", sort);
  }

  const response = await adminAxiosInstance.get(
    `/api/v1/admin/orders`,
    {
      params: params,
    },
  );
  return response.data;
};

const returnOrderItem = async ({ itemOrderId, reason, deatials }) => {
  const data = {
    reason: reason,
    deatials: deatials,
  };
  const response = await axiosInstance.post(
    `/api/v1/users/orders/${itemOrderId}/return`,
    data,
  );
  return response.data;
};

const retrunVerify = async (itemId) => {
  const response = await adminAxiosInstance.post(
    `/api/v1/admin/orders/${itemId}/return`,
  );
  return response.data;
};

const singleCancelVerify = async (itemId) => {
  const response = await adminAxiosInstance.post(
    `/api/v1/admin/orders/item/${itemId}/verify`,
  );
  return response.data;
};

const downloadInvoice = async (itemOrderId) => {
  const response = await axiosInstance.get(`/api/v1/users/invoice/${itemOrderId}`, {
    responseType: "blob",
  });
  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `invoice-${itemOrderId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

const createRazorpayOrder = async (amount) => {
  console.log(amount)
  const res = await axiosInstance.post("/api/v1/users/payments/razorpay/order", { amount:amount });
  return res.data;
};

const verifyRazorpayPayment = async (paymentDetails) => {
  console.log(paymentDetails,'in the ordrerserviece')
  const res = await axiosInstance.post(
    "/api/v1/users/payments/razorpay/verify",
     paymentDetails 
  );
  return res.data;
};

const verifyPaymentForWallet = async (paymentDetails) => {
  const res = await axiosInstance.post(
    "/api/v1/users/payments/razorpay/wallet/verify",
     paymentDetails 
  );
  return res.data;
};


const submitReview = async ({ itemId, rating, review }) => {
  const data = {
    rating: rating,
    review: review,
  };
  console.log(data,itemId,'-----')
  const response = await axiosInstance.post(
    `/api/v1/users/orders/${itemId}/review`,
    data,
  );
  return response.data;
};

const updateOrderStatus = async (orderID) => {
  console.log(orderID,'in serviece')
  const response = await adminAxiosInstance.delete(
    `/api/v1/admin/orders/${itemOrderId}`,
    data,
  );
  return response.data;
};

const orderService = {
  verifyPaymentForWallet,
  updateOrderStatus,
  placeOrder,
  getOrders,
  cancelOrderItem,
  cancelVerify,
  changeOrderStatus,
  getALlOrders,
  returnOrderItem,
  retrunVerify,
  downloadInvoice,
  createRazorpayOrder,
  verifyRazorpayPayment,
  cancelSingleOrderItem,
  singleCancelVerify,
  submitReview
};

export default orderService;
