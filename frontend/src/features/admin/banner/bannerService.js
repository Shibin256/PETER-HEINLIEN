import axiosInstance from "../../../api/axiosInstance"

const createBanner=async(formData)=>{
    const response=await axiosInstance.post('/api/admin/banner/add',formData)
    return response.data
}

const bannerService={
    createBanner
} 
export default bannerService