import adminAxiosInstance from "../../api/adminAxiosInstance";
import axiosInstance from "../../api/axiosInstance";

//fetching products
const getProducts = async (params) => {
  const response = await axiosInstance.get(
    `/api/v1/products?${params.toString()}`,
  );
  return response.data;
};

//fetching producs  for collection
const getLatestCollection = async () => {
  const response = await axiosInstance.get(`/api/v1/products/latest`);
  return response.data;
};

//adding products
const addProducts = async (formData) => {
  const response = await adminAxiosInstance.post("/api/v1/products", formData);
  return response.data;
};

// deleteProduct using id
const deleteProduct = async (id) => {
  const response = await adminAxiosInstance.delete(`/api/v1/product/${id}`);
  return response.data;
};

//editing product
const updateProduct = async (id, data) => {
  const res = await adminAxiosInstance.put(`/api/v1/product/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
  return res.data;
};

// fetching brand and category
const getBrandAndCollection = async () => {
  const res = await axiosInstance.get("/api/v1/products/getBrandsAndCollection");
  return res.data;
};

// fetching single product
const getProducById = async (id) => {
  const res = await axiosInstance.get(`/api/v1/product/${id}`);
  return res.data;
};

const getRelatedProducts = async (id) => {
  const res = await axiosInstance.get(`/api/v1/products/${id}/related`);
  return res.data;
};

const addProductOffer = async ({ productId, percentage }) => {
  const res = await adminAxiosInstance.post("/api/v1/admin/offers", {
    productId,
    percentage,
  });
  return res.data;
};

const removeProductOffer = async (productId) => {
  const res = await adminAxiosInstance.delete(
    `/api/v1/admin/offers/${productId}`,
  );
  return res.data;
};

// fetching brand and category
const getBrandAndCategory = async (page, limit) => {
  const params = new URLSearchParams({ page, limit });
  const res = await axiosInstance.get("/api/v1/brand/category", {
    params: params,
  });
  return res.data;
};

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
  getBrandAndCategory,
};

export default productService;
