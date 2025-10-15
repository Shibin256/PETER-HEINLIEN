import axiosInstance from "../../api/axiosInstance";

const addToWallet = async (userId, amount, paymentId) => {
  const response = await axiosInstance.post(
    `/api/v1/users/wallet/${userId}/${amount}/${paymentId}`,
  );
  return response.data;
};

const getWallet = async (userId, page, limit) => {
  const params = new URLSearchParams({ page, limit });
  console.log(params, '--',userId)
  const response = await axiosInstance.get(`/api/v1/users/wallet/${userId}`, {
    params: params,
  });
  console.log(response.data,'-------')
  return response.data;
};

const walletService = {
  addToWallet,
  getWallet,
};

export default walletService;
