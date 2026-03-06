import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { updateAddress } from '../../features/accountSettings/accountSlice';
import { validateAddress } from './AddressValidation';

const EditAddressModal = ({ address, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ ...address });

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

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateAddress({
      ...form,
    });

    if (errors.length > 0) {
      toast.error(errors.join('\n'));
      return;
    }

    try {
      await dispatch(
        updateAddress({ addressId: address._id, data: form })
      ).unwrap();
      toast.success('Address updated successfully');
      onSuccess();
    } catch (err) {
      console.log(err);
      toast.error('Failed to update address');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Address</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            required={true}
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border p-2 rounded"
          />
          <input
            name="house"
            required={true}
            value={form.house}
            onChange={handleChange}
            placeholder="House"
            className="w-full border p-2 rounded"
          />
          <input
            name="locality"
            required={true}
            value={form.locality}
            onChange={handleChange}
            placeholder="Locality"
            className="w-full border p-2 rounded"
          />
          <input
            name="city"
            required={true}
            value={form.city}
            onChange={handleChange}
            placeholder="City"
            className="w-full border p-2 rounded"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State <span className="text-red-500"></span>
            </label>
            <select
              name="state"
              value={form.state}
              onChange={handleChange}
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
          <input
            name="pincode"
            required={true}
            value={form.pincode}
            onChange={handleChange}
            placeholder="Pincode"
            className="w-full border p-2 rounded"
          />
          <input
            type="tel"
            name="phone"
            value={form.phone}
            required={true}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full border p-2 rounded"
          />
          <input
            type="tel"
            name="alternativePhone"
            value={form.alternativePhone}
            onChange={handleChange}
            placeholder="alternative Phone"
            className="w-full border p-2 rounded"
          />

          {/* {form.alternativePhone &&<input name="phone" value={form.alternativePhone} onChange={handleChange} placeholder="Phone" className="w-full border p-2 rounded" />} */}
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAddressModal;
