import adminAxiosInstance from "../../api/adminAxiosInstance";
import axiosInstance from "../../api/axiosInstance";

const placeOrder = async (orderData) => {
  const response = await axiosInstance.post('/api/user/orders/placeOrder', orderData);
  return response.data;
}

const getOrders = async (userId, search,page,limit) => {
  const params = new URLSearchParams({page,limit});
  if (search) {
    params.append('search', search);
  }

  const response = await axiosInstance.get(`/api/user/orders/${userId}`, {
    params: params,
  });

  return response.data;
};


const cancelOrderItem = async (data) => {
  const response = await axiosInstance.post(`/api/user/orders/cancelItem`, data);
  return response.data;
}

const cancelVerify = async (itemOrderId) => {
  const response = await adminAxiosInstance.post(`/api/admin/orders/verifyCancel/${itemOrderId}`)
  return response.data;
}

const changeOrderStatus = async ({ itemOrderId, data }) => {
  const response = await adminAxiosInstance.post(`/api/admin/orders/changeStatus/${itemOrderId}`, data)
  return response.data;
}

const getALlOrders = async (search, page, limit, sort) => {

  const params = new URLSearchParams({ page, limit });
  if (search) {
    params.append('search', search);
  }
  if (sort) {
    params.append('sort', sort);
  }

  const response = await adminAxiosInstance.get(`/api/admin/orders/getAllOrders`, {
    params: params,
  });
  return response.data;
}

const returnOrderItem = async ({ itemOrderId, reason, deatials }) => {
  const data = {
    reason: reason,
    deatials: deatials
  };
  const response = await axiosInstance.post(`/api/user/orders/returnItem/${itemOrderId}`, data);
  return response.data;
}

const retrunVerify = async (itemId) => {
  const response = await adminAxiosInstance.post(`/api/admin/orders/verifyReturn/${itemId}`);
  return response.data;
}

const downloadInvoice = async (itemOrderId) => {
  const response = await axiosInstance.get(`/api/user/invoice/${itemOrderId}`, {
    responseType: 'blob', // 👈 Important for downloading files
  })
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `invoice-${itemOrderId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

const orderService = {
  placeOrder,
  getOrders,
  cancelOrderItem,
  cancelVerify,
  changeOrderStatus,
  getALlOrders,
  returnOrderItem,
  retrunVerify,
  downloadInvoice
}

export default orderService;