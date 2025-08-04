import adminAxiosInstance from "../../../api/adminAxiosInstance";

const addCategory = async (category) => {
  const res = await adminAxiosInstance.post("/api/admin/addCategory", {
    category,
  });
  return res.data;
};

const deleteCategory = async (id) => {
  const res = await adminAxiosInstance.delete(
    `/api/admin/deleteCategory/${id}`,
  );
  return res.data;
};

const editCategory = async (id, name) => {
  const data = { name };
  const res = await adminAxiosInstance.put(
    `api/admin/editCategory/${id}`,
    data,
  );
  return res.data;
};

const addBrand = async (formData) => {
  const res = await adminAxiosInstance.post("/api/admin/addBrand", formData);
  return res.data;
};

const deleteBrnad = async (id) => {
  const res = await adminAxiosInstance.delete(`/api/admin/deleteBrand/${id}`);
  return res.data;
};

const editBrand = async (id, data) => {
  const res = await adminAxiosInstance.put(`api/admin/editBrand/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
  return res.data;
};

const addCategoryOffer = async ({ categoryId, percentage }) => {
  console.log(categoryId, percentage);
  const res = await adminAxiosInstance.post("/api/admin/addOffer", {
    categoryId,
    percentage,
  });
  return res.data;
};

const removeCategoryOffer = async (categoryId) => {
  const res = await adminAxiosInstance.delete(
    `/api/admin/removeOffer/${categoryId}`,
  );
  return res.data;
};

const inventoryService = {
  addCategory,
  addBrand,
  deleteCategory,
  deleteBrnad,
  editBrand,
  editCategory,
  removeCategoryOffer,
  addCategoryOffer,
};

export default inventoryService;
