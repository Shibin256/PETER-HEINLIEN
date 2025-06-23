import axiosInstance from "../../api/axiosInstance";

//fetching producs
const getProducts=async (params)=>{
    const response=await axiosInstance.get(`/api/products/get?${params.toString()}`)
    return response.data
}

//fetching producs  for collection
const getLatestCollection=async ()=>{
    const response=await axiosInstance.get(`/api/products/getCollection`)
    return response.data
}


//adding products
const addProducts=async (formData)=>{
    const response= await axiosInstance.post('/api/products/add',formData)
    return response.data
}

// deleteProduct using id
const deleteProduct=async(id)=>{
    const response=await axiosInstance.delete(`/api/products/${id}`)
    return response.data
}

//editing product
const updateProduct = async (id, data) => {
  const res = await axiosInstance.put(`/api/products/update/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });
  return res.data;
};

// fetching brand and category
const getBrandAndCollection=async()=>{
      const res=await axiosInstance.get('/api/products/getBrandsAndCollection')
      return res.data
}

// fetching single product
const getProducById=async(id)=>{
  const res=await axiosInstance.get(`/api/products/${id}`)
  return res.data
}


const productService ={
    getProducts,
    addProducts,
    deleteProduct,
    updateProduct,
    getBrandAndCollection,
    getProducById,
    getLatestCollection
}

export default productService