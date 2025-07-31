import axiosInstance from "../../api/axiosInstance"

const addToWallet= async (userId,amount,paymentId) => {
    const response = await axiosInstance.post(`/api/user/wallet/${userId}/${amount}/${paymentId}`)
    return response.data
}

const getWallet= async (userId) => {
    const response = await axiosInstance.get(`/api/user/wallet/${userId}`)
    return response.data
}


const walletService = {
    addToWallet,
    getWallet
}

export default walletService