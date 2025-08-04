import axiosInstance from "../../api/axiosInstance";

const changeName = async (userId, data) => {
  const res = await axiosInstance.patch(`/api/user/account/${userId}`, data, {
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
    `/api/user/account/editMobile/${userId}`,
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
    `/api/user/account/editPassword/${userId}`,
    data,
  );
  return res.data;
};

const uploadImage = async (userId, data) => {
  const res = await axiosInstance.patch(
    `/api/user/account/editImage/${userId}`,
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
    `/api/user/account/addAddress/${userId}`,
    data,
  );
  return res.data;
};

const getAllAddress = async (userId) => {
  const res = await axiosInstance.post(
    `/api/user/account/getAllAddress/${userId}`,
  );
  return res.data;
};

const removeAddress = async (userId, addresId) => {
  const res = await axiosInstance.delete(
    `/api/user/account/removeAddress/${userId}/${addresId}`,
  );
  return res.data;
};

const setDefault = async (userId, addresId) => {
  const res = await axiosInstance.patch(
    `/api/user/account/setDefault/${userId}/${addresId}`,
  );
  return res.data;
};

const updateAdress = async (addresId, data) => {
  const res = await axiosInstance.put(
    `/api/user/account/updateAddress/${addresId}`,
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
