import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AccountEditCard from "../../../components/user/AccountEditCard";
import { useDispatch } from "react-redux";
import { changeName } from "../../../features/accountSettings/accountSlice";
import { setUser } from "../../../features/auth/authSlice";
import { toast } from "react-toastify";

const EditName = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const profileData = location.state?.profileData;
  const dispatch = useDispatch();

  const handleBack = () => {
    navigate(-1);
  };

  const handleSave = (newName) => {
    const formData = new FormData();
    if (!newName.trim()) {
      toast.error("proper name needed");
    } else {
      formData.append("name", newName);
      dispatch(changeName({ userId: profileData.id, data: formData }))
        .then((res) => {
          const updatedUser = res.payload?.data;
          if (updatedUser) {
            dispatch(setUser({ user: updatedUser }));
            localStorage.setItem("user", JSON.stringify(updatedUser));
            toast.success(res.payload?.message);
            navigate("/my-profile");
          } else {
            toast.error("user Name changing failed");
          }
        })
        .catch((err) => {
          toast.error(err);
          console.error("Name update failed:", err);
        });
    }
  };

  return (
    <AccountEditCard
      title="YOUR ACCOUNT"
      description={`If you want to change the name associated with your "${profileData.email}" customer account, you may do so below. Be sure to click the Save Changes button when you are done.`}
      placeholder="Enter the new name"
      value=""
      type="text"
      onBack={handleBack}
      onVerify={handleSave}
      onVerifyButtonName="save changes"
      onBackButtonName="cancel"
    />
  );
};

export default EditName;
