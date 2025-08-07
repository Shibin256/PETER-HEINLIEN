import React, { useState } from "react";
import Title from "../../../components/common/Title";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addAddress } from "../../../features/accountSettings/accountSlice";
import { useNavigate } from "react-router-dom";

const AddAddress = () => {
  const [addressData, setAddressData] = useState({
    name: "",
    houseNo: "",
    locality: "",
    city: "",
    state: "",
    pin: "",
    phone: "",
    altPhone: "",
    addressType: "home", // home or work
    defaultAddress: false,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  // console.log(user,'user is here')

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Lakshadweep",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Puducherry",
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = [
      "name",
      "houseNo",
      "locality",
      "city",
      "state",
      "pin",
      "phone",
    ];
    const missingFields = requiredFields.filter(
      (field) => !addressData[field].trim(),
    );

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in all required fields: ${missingFields.join(", ")}`,
      );
      return;
    }

    if (addressData.altPhone === addressData.phone) {
      toast.error(
        "Alternative phone number cannot be the same as the primary phone number.",
      );
      return;
    }

    // Format address data
    const formattedAddress = {
      name: addressData.name,
      house: addressData.houseNo,
      locality: addressData.locality,
      city: addressData.city,
      state: addressData.state,
      pin: addressData.pin,
      phone: addressData.phone,
      altPhone: addressData.altPhone,
      addressType: addressData.addressType,
      defaultAddress: addressData.defaultAddress,
    };

    console.log("New Address Data:", formattedAddress);

    try {
      await dispatch(
        addAddress({ userId: user._id, data: formattedAddress }),
      ).then((res) => {
        if (res.type.endsWith("/fulfilled")) {
          toast.success("✅ address added successfully!");
          navigate("/my-address");
        } else {
          toast.error(res?.error?.message || "Failed to delete user.");
        }
      });
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "error hapened");
    }

    // Here you would typically save to your state management or API
    // For now, we'll just log and show success message
    // alert('Address saved successfully!');

    // Reset form
    setAddressData({
      name: "",
      houseNo: "",
      locality: "",
      city: "",
      state: "",
      pin: "",
      phone: "",
      altPhone: "",
      addressType: "home",
      defaultAddress: false,
    });
  };

  const handleCancel = () => {
    // Navigate back or reset form
    window.history.back();
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Title text1={"Add New"} text2={"Address"} />

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Address Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Address Type
            </label>
            <div className="flex space-x-6">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="home"
                  name="addressType"
                  value="home"
                  checked={addressData.addressType === "home"}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label
                  htmlFor="home"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Home
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="work"
                  name="addressType"
                  value="work"
                  checked={addressData.addressType === "work"}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label
                  htmlFor="work"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Work
                </label>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={addressData.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Address Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                House/Building No <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="houseNo"
                value={addressData.houseNo}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="House/Flat/Building No"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Locality/Area <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="locality"
                value={addressData.locality}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Locality/Area/Street"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={addressData.city}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter city"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <select
                name="state"
                value={addressData.state}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select State</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pincode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="pin"
              value={addressData.pin}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter pincode"
              maxLength="6"
              pattern="[0-9]{6}"
              required
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={addressData.phone}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter phone number"
                maxLength="10"
                pattern="[0-9]{10}"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alternative Phone (Optional)
              </label>
              <input
                type="tel"
                name="altPhone"
                value={addressData.altPhone}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Alternative phone number"
                maxLength="10"
                pattern="[0-9]{10}"
              />
            </div>
          </div>

          {/* Default Address Checkbox
          <div className="flex items-center">
            <input
              type="checkbox"
              id="defaultAddress"
              name="defaultAddress"
              checked={addressData.defaultAddress}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="defaultAddress"
              className="ml-2 block text-sm text-gray-700"
            >
              Set as default address
            </label>
          </div> */}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAddress;
