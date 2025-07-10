import adminAxiosInstance from "../../../api/adminAxiosInstance"
import axiosInstance from "../../../api/axiosInstance"

const createBanner=async(formData)=>{
    const response=await adminAxiosInstance.post('/api/admin/banner/add',formData)
    return response.data
}

const bannerService={
    createBanner
} 
export default bannerService