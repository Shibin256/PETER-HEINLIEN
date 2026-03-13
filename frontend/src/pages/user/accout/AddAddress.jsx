import React, { useState } from 'react';
import Title from '../../../components/common/Title';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { addAddress } from '../../../features/accountSettings/accountSlice';
import { useNavigate } from 'react-router-dom';

const AddAddress = () => {
  const [addressData, setAddressData] = useState({
    name: '',
    houseNo: '',
    locality: '',
    city: '',
    state: '',
    pin: '',
    phone: '',
    altPhone: '',
    addressType: 'home',
    defaultAddress: false,
  });

  // New state to track specific field errors
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Lakshadweep',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Jammu and Kashmir',
    'Ladakh',
    'Puducherry',
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // Presence Check
    if (!addressData.name.trim()) newErrors.name = 'Full name is required';
    if (!addressData.houseNo.trim())
      newErrors.houseNo = 'House/Building No is required';
    if (!addressData.locality.trim())
      newErrors.locality = 'Locality is required';
    if (!addressData.city.trim()) newErrors.city = 'City is required';
    if (!addressData.state) newErrors.state = 'Please select a state';
    if (!addressData.pin.trim()) newErrors.pin = 'Pincode is required';
    if (!addressData.phone.trim()) newErrors.phone = 'Phone number is required';

    // Format Checks
    if (
      addressData.name &&
      !/^[a-zA-Z\s]{2,50}$/.test(addressData.name.trim())
    ) {
      newErrors.name = 'Name should only contain letters (2-50 chars)';
    }

    if (addressData.pin && !/^\d{6}$/.test(addressData.pin.trim())) {
      newErrors.pin = 'PIN code must be a 6-digit number';
    }

    if (addressData.phone && !/^\d{10}$/.test(addressData.phone.trim())) {
      newErrors.phone = 'Phone must be a valid 10-digit number';
    }

    if (addressData.altPhone) {
      if (!/^\d{10}$/.test(addressData.altPhone.trim())) {
        newErrors.altPhone = 'Alternative phone must be 10 digits';
      }
      if (addressData.altPhone === addressData.phone) {
        newErrors.altPhone = 'Cannot be the same as primary phone';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const formattedAddress = {
      ...addressData,
      name: addressData.name.trim(),
      house: addressData.houseNo.trim(),
      locality: addressData.locality.trim(),
      city: addressData.city.trim(),
    };

    try {
      const res = await dispatch(
        addAddress({ userId: user._id, data: formattedAddress })
      );
      if (res.type.endsWith('/fulfilled')) {
        toast.success('✅ Address added successfully!');
        navigate('/my-address');
      } else {
        toast.error(res.payload?.errors?.[0] || 'Failed to add address.');
      }
    } catch (err) {
      console.log(err);
      toast.error('Something went wrong');
    }
  };

  const handleCancel = () => window.history.back();

  // Helper component for Error Display
  const ErrorMsg = ({ name }) =>
    errors[name] ? (
      <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
    ) : null;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Title text1={'Add New'} text2={'Address'} />

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Address Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address Type
            </label>
            <div className="flex space-x-6">
              {['home', 'work'].map((type) => (
                <div key={type} className="flex items-center">
                  <input
                    type="radio"
                    id={type}
                    name="addressType"
                    value={type}
                    checked={addressData.addressType === type}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label
                    htmlFor={type}
                    className="ml-2 text-sm text-gray-700 capitalize"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={addressData.name}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-md focus:ring-2 ${errors.name ? 'border-red-500 ring-red-200' : 'border-gray-300'}`}
              placeholder="Enter your full name"
            />
            <ErrorMsg name="name" />
          </div>

          {/* House & Locality */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                House/Building No *
              </label>
              <input
                type="text"
                name="houseNo"
                value={addressData.houseNo}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md ${errors.houseNo ? 'border-red-500' : 'border-gray-300'}`}
              />
              <ErrorMsg name="houseNo" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Locality/Area *
              </label>
              <input
                type="text"
                name="locality"
                value={addressData.locality}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md ${errors.locality ? 'border-red-500' : 'border-gray-300'}`}
              />
              <ErrorMsg name="locality" />
            </div>
          </div>

          {/* City & State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={addressData.city}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
              />
              <ErrorMsg name="city" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <select
                name="state"
                value={addressData.state}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select State</option>
                {indianStates.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ErrorMsg name="state" />
            </div>
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pincode *
            </label>
            <input
              type="text"
              name="pin"
              value={addressData.pin}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-md ${errors.pin ? 'border-red-500' : 'border-gray-300'}`}
              maxLength="6"
            />
            <ErrorMsg name="pin" />
          </div>

          {/* Phones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={addressData.phone}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                maxLength="10"
              />
              <ErrorMsg name="phone" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alternative Phone
              </label>
              <input
                type="tel"
                name="altPhone"
                value={addressData.altPhone}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md ${errors.altPhone ? 'border-red-500' : 'border-gray-300'}`}
                maxLength="10"
              />
              <ErrorMsg name="altPhone" />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
