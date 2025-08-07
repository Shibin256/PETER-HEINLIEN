import adminAxiosInstance from "../../../api/adminAxiosInstance";
import axiosInstance from "../../../api/axiosInstance";

const createBanner = async (formData) => {
  const response = await adminAxiosInstance.post(
    "/api/admin/banner/add",
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
    "/api/admin/banner/fetchBanners",);
  return response.data;
};

const deleteBanner = async ({ bannerId }) => {
  const response = await adminAxiosInstance.delete(
    `/api/admin/banner/deleteBanner/${bannerId}`,);
  return response.data;
};

const setActiveBanner = async ({ bannerId }) => {
  console.log(bannerId, 'in ser')
  const response = await adminAxiosInstance.put(
    `/api/admin/banner/setActiveBanner/${bannerId}`,);
  return response.data;
};


const fetchHomeBanner = async () => {
  const response = await axiosInstance.get(
    "/api/user/banner/fetchHomeBanner",);
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
