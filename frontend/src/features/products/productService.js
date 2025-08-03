import adminAxiosInstance from "../../api/adminAxiosInstance";
import axiosInstance from "../../api/axiosInstance";

//fetching producs
const getProducts = async (params) => {
  const response = await axiosInstance.get(`/api/products/get?${params.toString()}`)
  return response.data
}

//fetching producs  for collection
const getLatestCollection = async () => {
  const response = await axiosInstance.get(`/api/products/getCollection`)
  return response.data
}


//adding products
const addProducts = async (formData) => {
  const response = await adminAxiosInstance.post('/api/products/add', formData)
  return response.data
}

// deleteProduct using id
const deleteProduct = async (id) => {
  const response = await adminAxiosInstance.delete(`/api/products/${id}`)
  return response.data
}

//editing product
const updateProduct = async (id, data) => {
  const res = await adminAxiosInstance.put(`/api/products/update/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });
  return res.data;
};

// fetching brand and category
const getBrandAndCollection = async () => {
  const res = await axiosInstance.get('/api/products/getBrandsAndCollection')
  return res.data
}

// fetching single product
const getProducById = async (id) => {
  const res = await axiosInstance.get(`/api/products/${id}`)
  return res.data
}

const getRelatedProducts = async (id) => {
  const res = await axiosInstance.get(`/api/products/relatedProducts/${id}`)
  return res.data
}

const addProductOffer = async ({ productId, percentage }) => {
  const res = await adminAxiosInstance.post('/api/products/addOffer', {
    productId,
    percentage,
  });
  return res.data;
};

const removeProductOffer = async (productId) => {
  const res = await adminAxiosInstance.delete(`/api/products/removeOffer/${productId}`);
  return res.data;
};

// fetching brand and category
const getBrandAndCategory = async (page, limit) => {
  const params = new URLSearchParams({ page, limit });
  const res = await axiosInstance.get('/api/products/getBrandAndCategory',{
    params: params,
  })
  return res.data
}

const productService = {
  getProducts,
  addProducts,
  deleteProduct,
  updateProduct,
  getBrandAndCollection,
  getProducById,
  getLatestCollection,
  getRelatedProducts,
  addProductOffer,
  removeProductOffer,
  getBrandAndCategory
}

export default productService