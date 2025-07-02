import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllAddress } from '../../features/accountSettings/accountSlice';
import EditAddressModal from '../../components/common/EditAddress';

const Checkout = () => {
    const [step, setStep] = useState(1);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'Guest' };

    const { addresses } = useSelector(state => state.account);
    console.log(addresses, 'addresses in checkout');

    useEffect(() => {
        dispatch(getAllAddress(user._id));
    }, []);

    const handleEdit = (addr) => {
        setSelectedAddress(addr);
        setEditModalOpen(true);
    };

    return (
        <div className="max-w-6xl mx-auto my-10 p-6">
            <h2 className="text-3xl font-bold text-green-700 border-b-2 border-green-500 pb-3 mb-8">CHECKOUT</h2>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column - Checkout Steps */}
                <div className="lg:w-2/3">
                    {/* Step 1: Login */}
                    <div className="mb-8 p-5 bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold mr-3">1</div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    LOGIN {user && <span className="text-blue-600 ml-2">✔</span>}
                                </h3>
                            </div>
                            <button onClick={() => navigate('/My-profile')} className="px-4 py-1 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 text-sm shadow-sm">
                                CHANGE
                            </button>
                        </div>
                        <p className="ml-11 mt-2 text-sm text-gray-700">
                            Customer <span className="font-medium">name: {user.username}</span>
                        </p>
                    </div>

                    {/* Step 2: Address */}
                    <div className="mb-8 p-5 bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold mr-3">2</div>
                            <h3 className="text-lg font-semibold text-gray-800">ADDRESS</h3>
                        </div>

                        <div className="space-y-4 mb-4">
                            {addresses?.length > 0 ? (
                                addresses.map((addr, index) => (
                                    <div
                                        key={addr._id || index}
                                        className={`border-2 ${selectedAddress?._id === addr._id ? 'border-green-500 bg-green-50' : 'border-gray-200'
                                            } p-4 rounded-md flex items-start justify-between transition-colors duration-200`}
                                    >
                                        <div className="flex-grow">
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="address"
                                                    className="accent-green-600 h-5 w-5"
                                                    checked={selectedAddress?._id === addr._id}
                                                    onChange={() => setSelectedAddress(addr)}
                                                />
                                                <div className="ml-2">
                                                    <div className="flex items-center space-x-3">
                                                        <span className="font-medium text-gray-800">{addr.name}</span>
                                                        <span className="text-gray-500 text-sm">{addr.phone}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-700 mt-2">
                                                        {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                                                    </p>
                                                </div>
                                            </label>
                                        </div>
                                        <button
                                            className="px-4 py-1 bg-white text-emerald-700 rounded-md border border-emerald-700 hover:bg-emerald-50 text-sm shadow-sm ml-4"
                                            onClick={() => {handleEdit(addr)}}
                                        >
                                            EDIT
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-600 ml-11">No addresses found. Please add a new address.</p>
                            )}
                        </div>

                        <button
                            className="ml-11 bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 font-medium shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!selectedAddress}
                            onClick={() => {
                                // Handle delivery logic here (e.g., proceed to payment)
                                console.log('Deliver to:', selectedAddress);
                            }}
                        >
                            DELIVER HERE
                        </button>

                        <button
                            className="ml-11 mt-4 text-blue-600 hover:text-blue-800 text-sm flex items-center font-medium"
                            onClick={() => {navigate('/add-address')}}
                        >
                            <span className="text-xl mr-1">+</span> Add a new address
                        </button>
                    </div>
                </div>

                {/* Right Column - Order Summary */}
                <div className="lg:w-1/3">
                    <div className="sticky top-4">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 mb-4">
                            <h3 className="text-xl font-bold text-gray-800 mb-5 pb-2 border-b">ORDER SUMMARY</h3>

                            {/* You can add items list here */}
                            <div className="mb-4">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-700">Item (x1)</span>
                                    <span className="font-medium">₹352</span>
                                </div>
                            </div>
                        </div>

                        {/* Price Summary */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4">PRICE DETAILS</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm text-gray-700">
                                    <span>Price (1 item)</span>
                                    <span>₹352</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-700">
                                    <span>Delivery Charges</span>
                                    <span className="text-green-600 font-medium">FREE</span>
                                </div>
                            </div>
                            <hr className="my-4 border-gray-200" />
                            <div className="flex justify-between text-lg font-bold text-gray-800">
                                <span>Total Payable</span>
                                <span>₹357</span>
                            </div>
                        </div>

                        {/* Cancel Button */}
                        <div className="mt-6 flex justify-end">
                            <button
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-all shadow-md"
                                onClick={() => {navigate(-1)}}
                            >
                                CANCEL
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Edit Modal */}
            {editModalOpen && selectedAddress && (
                <EditAddressModal
                    address={selectedAddress}
                    onClose={() => {
                        setEditModalOpen(false);
                        setSelectedAddress(null);
                    }}
                    onSuccess={() => {
                        setEditModalOpen(false);
                        dispatch(getAllAddress(user._id));
                    }}
                />
            )}
        </div>
    );
};

export default Checkout;