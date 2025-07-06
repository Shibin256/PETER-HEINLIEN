import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { updateAddress } from '../../features/accountSettings/accountSlice';

const EditAddressModal = ({ address, onClose, onSuccess }) => {
    const dispatch = useDispatch();
    const [form, setForm] = useState({ ...address });
    console.log(form)

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(form)
            await dispatch(updateAddress({ addressId: address._id, data: form })).unwrap();
            toast.success('Address updated successfully');
            onSuccess();
        } catch (err) {
            toast.error('Failed to update address');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Edit Address</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full border p-2 rounded" />
                    <input name="house" value={form.house} onChange={handleChange} placeholder="House" className="w-full border p-2 rounded" />
                    <input name="locality" value={form.locality} onChange={handleChange} placeholder="Locality" className="w-full border p-2 rounded" />
                    <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="w-full border p-2 rounded" />
                    <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="w-full border p-2 rounded" />
                    <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="Pincode" className="w-full border p-2 rounded" />
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full border p-2 rounded" />
                    <input name="altphone" value={form.alternativePhone} onChange={handleChange} placeholder="alternative Phone" className="w-full border p-2 rounded" />
                    
                    {/* {form.alternativePhone &&<input name="phone" value={form.alternativePhone} onChange={handleChange} placeholder="Phone" className="w-full border p-2 rounded" />} */}
                    <div className="flex justify-end space-x-3 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAddressModal;
