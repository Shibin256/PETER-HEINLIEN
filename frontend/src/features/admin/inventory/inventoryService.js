import axiosInstance from "../../../api/axiosInstance";

const addCategory = async (category) => {
    const res = await axiosInstance.post('/api/admin/addCategory', { category })
    return res.data
}

const deleteCategory = async (id) => {
    const res = await axiosInstance.delete(`/api/admin/deleteCategory/${id}`)
    return res.data
}

const addBrand = async (formData) => {
    const res = await axiosInstance.post('/api/admin/addBrand', formData)
    return res.data
}

const deleteBrnad = async (id) => {
    const res = await axiosInstance.delete(`/api/admin/deleteBrand/${id}`)
    return res.data
}

const editBrand=async(id,data)=>{
    const res=await axiosInstance.put(`api/admin/editBrand/${id}`,data,{
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  })
  return res.data
}


const inventoryService = {
    addCategory,
    addBrand,
    deleteCategory,
    deleteBrnad,
    editBrand
}

export default inventoryService