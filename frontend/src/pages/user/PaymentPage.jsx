import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { placeOrder } from '../../features/orders/ordersSlice';

const PaymentPage = () => {
    const [selectedPayment, setSelectedPayment] = useState('');
    const [showCODMessage, setShowCODMessage] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [orderStatus, setOrderStatus] = useState(null); // 'success' or 'error'
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderId, setOrderId] = useState('')
    const [date, setDate] = useState('')
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch()

    const { address, cartItems, totalPrice, shippingCost, userId, deliveryDate } = location.state || {};
    const { currency } = useSelector(state => state.global);

    const handlePaymentChange = (method) => {
        setSelectedPayment(method);
        if (method === 'cod') {
            setShowCODMessage(true);
        } else {
            setShowCODMessage(false);
        }
    };

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        try {

            if (selectedPayment == 'cod') {
                const res = await dispatch(placeOrder({ orderdata: { address, cartItems, totalPrice, shippingCost, userId, deliveryDate }, paymentMethod: selectedPayment })).unwrap();
                setOrderId(res.order.orderId)
                console.log(res, 'order placed successfully');
                const date = new Date(res.order.DeliveryDate);
                const formattedDeliveryDate = date.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                });
                console.log(formattedDeliveryDate, 'order placed successfully');

                setDate(formattedDeliveryDate);
                setOrderStatus('success');
                setShowModal(true);
            }


            // // Randomly determine success/failure for demo purposes
            // const isSuccess = Math.random() > 0.2; // 80% success rate for demo
            // setOrderStatus(isSuccess ? 'success' : 'error');
            // setShowModal(true);

            // if (isSuccess) {
            //     // Clear cart or perform other success actions
            // }
        } catch (error) {
            setOrderStatus('error');
            setShowModal(true);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        if (orderStatus === 'success') {
            navigate('/orders'); // Redirect to orders page on success
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-sm">
            <h2 className="text-3xl font-bold text-green-700 mb-6 border-b-2 border-green-200 pb-3">PAYMENT</h2>

            {/* Payment Methods */}
            <div className="mb-6 bg-white rounded-lg shadow overflow-hidden">
                <div className="space-y-1">
                    {/* UPI Option */}
                    <div className={`p-4 transition-all ${selectedPayment === 'upi' ? 'bg-green-50 border-l-4 border-green-500' : 'hover:bg-gray-50'}`}>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="payment"
                                className="h-5 w-5 text-green-600 focus:ring-green-500"
                                checked={selectedPayment === 'upi'}
                                onChange={() => handlePaymentChange('upi')}
                            />
                            <div className="ml-3">
                                <span className="block font-medium text-gray-800">UPI Payment</span>
                                <span className="block text-sm text-gray-500">Pay instantly using any UPI app</span>
                            </div>
                            <div className="ml-auto flex space-x-2">
                                {/* UPI app icons would go here */}
                            </div>
                        </label>
                    </div>

                    {/* Net Banking Option */}
                    <div className={`p-4 transition-all ${selectedPayment === 'netbanking' ? 'bg-green-50 border-l-4 border-green-500' : 'hover:bg-gray-50'}`}>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="payment"
                                className="h-5 w-5 text-green-600 focus:ring-green-500"
                                checked={selectedPayment === 'netbanking'}
                                onChange={() => handlePaymentChange('netbanking')}
                            />
                            <div className="ml-3">
                                <span className="block font-medium text-gray-800">Net Banking</span>
                                <span className="block text-sm text-gray-500">Direct bank transfer</span>
                            </div>
                        </label>
                    </div>

                    {/* Cash on Delivery Option */}
                    <div className={`p-4 transition-all ${selectedPayment === 'cod' ? 'bg-green-50 border-l-4 border-green-500' : 'hover:bg-gray-50'}`}>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="payment"
                                className="h-5 w-5 text-green-600 focus:ring-green-500"
                                checked={selectedPayment === 'cod'}
                                onChange={() => handlePaymentChange('cod')}
                            />
                            <div className="ml-3">
                                <span className="block font-medium text-gray-800">Cash on Delivery</span>
                                <span className="block text-sm text-gray-500">Pay when you receive your order</span>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {/* COD Handling Fee Message */}
            {showCODMessage && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Cash on Delivery Notice</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                            <p>Due to additional handling costs, a nominal charge of ₹5 will be added to your order total.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Summary */}
            <div className="mb-6 bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">ORDER SUMMARY</h3>
                </div>
                <div className="p-4">
                    <div className="flex justify-between py-2">
                        <span className="text-gray-600">Price (1 item)</span>
                        <span className="font-medium">{totalPrice}</span>
                    </div>
                    <div className="flex justify-between py-2 text-green-600">
                        <span>Delivery Charges</span>
                        {shippingCost ? `${currency}${shippingCost}` : <span>FREE</span>}
                    </div>
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-between py-2 font-bold text-lg">
                        <span>Total Payable</span>
                        <span>{showCODMessage && ` ${currency}${totalPrice} `}</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    CANCEL
                </button>
                <button
                    onClick={handlePlaceOrder}
                    className={`px-6 py-2 rounded-md text-white transition-colors ${selectedPayment ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    disabled={!selectedPayment || isProcessing}
                >
                    {isProcessing ? (
                        'PROCESSING...'
                    ) : selectedPayment === 'cod' ? (
                        'CONFIRM ORDER'
                    ) : (
                        'PROCEED TO PAYMENT'
                    )}
                </button>
            </div>

            {/* Order Status Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="text-center">
                            {orderStatus === 'success' ? (
                                <>
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="mt-3 text-lg font-medium text-gray-900">Order Placed Successfully!</h3>
                                    <div className="mt-2 text-sm text-gray-500">
                                        <p>Your order has been placed and will be delivered by {date}.</p>
                                        <p className="mt-2">Order ID: # {orderId}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                    <h3 className="mt-3 text-lg font-medium text-gray-900">Order Failed</h3>
                                    <div className="mt-2 text-sm text-gray-500">
                                        <p>There was an issue processing your order. Please try again or use a different payment method.</p>
                                    </div>
                                </>
                            )}
                            <div className="mt-5">
                                <button
                                    type="button"
                                    className={`inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white ${orderStatus === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} focus:outline-none sm:text-sm`}
                                    onClick={handleModalClose}
                                >
                                    {orderStatus === 'success' ? 'View Orders' : 'Try Again'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentPage;