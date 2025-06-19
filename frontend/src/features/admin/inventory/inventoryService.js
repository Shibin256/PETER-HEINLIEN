import axiosInstance from "../../../api/axiosInstance";

const addCategory=async(category)=>{    
    const res=await axiosInstance.post('/api/admin/addCategory',{category})
    console.log(res.data)
    return res.data
}

const addBrand=async(formData)=>{
     for (let [key, value] of formData.entries()) {
      console.log(`${key}:-------------------`, value);
    }
    
    const res=await axiosInstance.post('/api/admin/addBrand',formData)
    return res.data
}

const inventoryService ={
    addCategory,
    addBrand
}

export default inventoryService