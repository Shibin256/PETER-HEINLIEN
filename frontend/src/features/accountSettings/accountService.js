import axiosInstance from "../../api/axiosInstance";

const changeName = async (userId, data) => {
  const res = await axiosInstance.patch(`/api/v1/users/account/${userId}/name`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
  // console.log(res.data)
  return res.data;
};

const changeMobile = async (userId, data) => {
  const res = await axiosInstance.patch(
    `/api/v1/users/account/${userId}/mobile`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    },
  );
  return res.data;
};

const changePassword = async (userId, data) => {
  const res = await axiosInstance.patch(
    `/api/v1/users/account/${userId}/password`,
    data,
  );
  return res.data;
};

const uploadImage = async (userId, data) => {
  const res = await axiosInstance.patch(
    `/api/v1/users/account/${userId}/image`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    },
  );
  return res.data;
};

const addAddress = async (userId, data) => {
  const res = await axiosInstance.post(
    `/api/v1/users/account/${userId}/address`,
    data,
  );
  return res.data;
};

const getAllAddress = async (userId) => {
  const res = await axiosInstance.get(
    `/api/v1/users/account/${userId}/address`,
  );
  return res.data;
};

const removeAddress = async (userId, addresId) => {
  const res = await axiosInstance.delete(
    `/api/v1/users/account/${userId}/${addresId}`,
  );
  return res.data;
};

const setDefault = async (userId, addresId) => {
  const res = await axiosInstance.patch(
    `/api/v1/users/account/${userId}/${addresId}/default`,
  );
  return res.data;
};

const updateAdress = async (addresId, data) => {
  const res = await axiosInstance.put(
    `/api/v1/users/account/${addresId}`,
    data,
  );
  console.log(res.data, "service");
  return res.data;
};

const accountService = {
  changeName,
  changeMobile,
  changePassword,
  uploadImage,
  addAddress,
  getAllAddress,
  removeAddress,
  setDefault,
  updateAdress,
};

export default accountService;
