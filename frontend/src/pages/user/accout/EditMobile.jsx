import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AccountEditCard from "../../../components/user/AccountEditCard";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../features/auth/authSlice";
import { changeMobile } from "../../../features/accountSettings/accountSlice";
import { toast } from "react-toastify";

const EditMobile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false)
  const profileData = location.state?.profileData;
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth);
  console.log(user);
  const handleBack = () => {
    navigate(-1);
  };

  const handleSave = (newMobile) => {
    if (newMobile) {
      if (!/^\d{10}$/.test(newMobile)) {
        toast.error("The phone number must be 10");
        setLoading(false);
        return;
      }
      if (newMobile === "0000000000") {
        toast.error("dont give zero");
        setLoading(false);
        return;
      }
    }

    const validatePhoneNumber = (phone) => {
      const regex = /^[6-9]\d{9}$/;
      return regex.test(phone);
    };

    if (!validatePhoneNumber(newMobile)) {
      toast.error("Please enter a valid 10-digit phone number starting with 6-9.");
      return;
    }

    const formData = new FormData();
    formData.append("phone", newMobile);

    dispatch(changeMobile({ userId: profileData.id, data: formData }))
      .then((res) => {
        const updatedUser = res.payload?.data;

        if (updatedUser) {
          dispatch(setUser({ user: updatedUser }));
          toast.success(res.payload?.message);
          localStorage.setItem("user", JSON.stringify(updatedUser));
          navigate("/my-profile");
        } else {
          toast.error("user phone number changing failed");
        }
      })
      .catch((err) => {
        console.error("Mobile update failed:", err);
        const message = err?.response?.data?.message || "Something went wrong";
        toast.error(message);
      });
  };

  return (
    <AccountEditCard
      title="YOUR ACCOUNT"
      description={`If you want to change the mobile number associated with your "${profileData.email}" account, you may do so below. Be sure to click the Verify Email button to verify email by OTP.`}
      placeholder="Enter the new mobile number"
      value=""
      type="number"
      onBack={handleBack}
      onVerify={handleSave}
      onVerifyButtonName="Save Changes"
      onBackButtonName="cancel"
    />
  );
};

export default EditMobile;
