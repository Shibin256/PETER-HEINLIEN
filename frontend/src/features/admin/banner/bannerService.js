import adminAxiosInstance from "../../../api/adminAxiosInstance";
import axiosInstance from "../../../api/axiosInstance";

const createBanner = async (formData) => {
  const response = await adminAxiosInstance.post(
    "/api/v1/admin/banner",
    formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
  );
  return response.data;
};

const fetchBanners = async () => {
  const response = await adminAxiosInstance.get(
    "/api/v1/admin/banner",);
  return response.data;
};

const deleteBanner = async ({ bannerId }) => {
  const response = await adminAxiosInstance.delete(
    `/api/v1/admin/banner/${bannerId}`,);
  return response.data;
};

const setActiveBanner = async ({ bannerId }) => {
  console.log(bannerId, 'in ser')
  const response = await adminAxiosInstance.put(
    `/api/v1/admin/banner/${bannerId}`,);
  return response.data;
};


const fetchHomeBanner = async () => {
  const response = await axiosInstance.get(
    "/api/v1/users/banner",);
  return response.data;
};


const bannerService = {
  createBanner,
  fetchBanners,
  deleteBanner,
  fetchHomeBanner,
  setActiveBanner
};
export default bannerService;
