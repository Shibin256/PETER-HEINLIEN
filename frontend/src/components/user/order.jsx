import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { cancelOrderItem, getOrders } from '../../features/orders/ordersSlice';
import { Dialog } from '@headlessui/react';

const Order = ({ order , onCancelSuccess}) => {
  console.log(order)
  const {
    Items = [],
    DeliveryCharge,
    DeliveryDate,
    OrderStatus,
    Order_Address,
    UserId,
    PaymentMethod,
    PaymentStatus,
    TotalAmount,
    orderId
  } = order;

  const dispatch = useDispatch();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedItemToCancel, setSelectedItemToCancel] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');

  // Status styling
  const statusStyles = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Processing': 'bg-blue-100 text-blue-800',
    'Shipped': 'bg-purple-100 text-purple-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
    'Returned': 'bg-orange-100 text-orange-800'
  };

  // Payment status styling
  const paymentStatusStyles = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Paid': 'bg-green-100 text-green-800',
    'Failed': 'bg-red-100 text-red-800',
    'Refunded': 'bg-blue-100 text-blue-800'
  };

  // Cancellation reasons
  const cancellationReasons = [
    'Changed my mind',
    'Found a better price elsewhere',
    'Item no longer needed',
    'Shipping takes too long',
    'Ordered by mistake',
    'Product specifications changed',
    'Other reason'
  ];

  // State for ratings and reviews
  const [ratings, setRatings] = useState(
    Items.reduce((acc, item) => {
      acc[item.itemOrderId] = 0;
      return acc;
    }, {})
  );

  const [reviews, setReviews] = useState(
    Items.reduce((acc, item) => {
      acc[item.itemOrderId] = '';
      return acc;
    }, {})
  );

  const [showReviewForm, setShowReviewForm] = useState(
    Items.reduce((acc, item) => {
      acc[item.itemOrderId] = false;
      return acc;
    }, {})
  );

  const handleRatingChange = (itemId, rating) => {
    setRatings(prev => ({ ...prev, [itemId]: rating }));
  };

  const handleReviewChange = (itemId, text) => {
    setReviews(prev => ({ ...prev, [itemId]: text }));
  };

  const toggleReviewForm = (itemId) => {
    setShowReviewForm(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const submitReview = (itemId) => {
    console.log(`Review submitted for item ${itemId}:`, { 
      rating: ratings[itemId],
      review: reviews[itemId]
    });
    toggleReviewForm(itemId);
  };

  // const openCancelModal = (itemOrderId) => {
  //   setSelectedItemToCancel(itemOrderId);
  //   setIsCancelModalOpen(true);
  // };

  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
    setSelectedItemToCancel(null);
    setCancellationReason('');
  };

  const confirmCancel = async () => {
    if (selectedItemToCancel && cancellationReason) {
      await dispatch(cancelOrderItem({
        itemOrderId: selectedItemToCancel,
        reason: cancellationReason
      }));
      onCancelSuccess()
      closeCancelModal();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
      {/* Order Header */}
      <div className="p-5 bg-gray-50 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center flex-wrap gap-3">
            <h2 className="text-xl font-bold text-gray-800">Order #{orderId}</h2>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyles[OrderStatus] || 'bg-gray-100 text-gray-800'}`}>
              {OrderStatus}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Estimated delivery: <span className="font-medium">{new Date(DeliveryDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-xs">
            <p className="text-lg font-bold text-gray-900">₹{TotalAmount}</p>
          </div>
          {OrderStatus!=='Cancelled' && 
            <div> <button 
            onClick={() =>(
              setSelectedItemToCancel(orderId),
              setIsCancelModalOpen(true))}
            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors border border-red-100"
          >
            Cancel Order
          </button>
          <button className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors border border-blue-100">
            Invoice
          </button>
          </div>
          }

        </div>
      </div>

      {/* Order Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {Items.map((item, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            {/* Product Image */}
            <div className="w-full h-48 flex items-center justify-center mb-4">
              <img 
                src={item.productImage[0]} 
                alt={item.productName} 
                className="max-h-full max-w-full object-contain rounded-lg bg-gray-50 p-2" 
              />
            </div>
            
            {/* Product Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{item.productName}</h3>
              
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                <div>
                  <span className="font-medium">Price:</span> ₹{item.productPrice}
                </div>
                <div>
                  <span className="font-medium">Qty:</span> {item.quantity}
                </div>
                <div>
                  <span className="font-medium">Subtotal:</span> ₹{item.subTotal}
                </div>
                <div>
                  <span className="font-medium">Status:</span> {item.status || OrderStatus}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-wrap gap-2">
                {/* <button 
                  onClick={() => openCancelModal(item.itemOrderId)}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors border border-red-100"
                >
                  Cancel Item
                </button> */}
                
                {OrderStatus === 'Delivered' && (
                  <button className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200">
                    Return/Replace
                  </button>
                )}
                
                {OrderStatus === 'Delivered' && (
                  <button 
                    onClick={() => toggleReviewForm(item.itemOrderId)}
                    className="px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg text-sm font-medium transition-colors border border-yellow-100"
                  >
                    {showReviewForm[item.itemOrderId] ? 'Hide Review' : 'Rate Product'}
                  </button>
                )}
              </div>

              {/* Rating and Review Section */}
              {OrderStatus === 'Delivered' && showReviewForm[item.itemOrderId] && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="text-md font-medium text-gray-800 mb-2">Rate this product</h4>
                  
                  {/* Star Rating */}
                  <div className="flex items-center mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingChange(item.itemOrderId, star)}
                        className="focus:outline-none"
                      >
                        <svg
                          className={`w-6 h-6 ${star <= ratings[item.itemOrderId] ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {ratings[item.itemOrderId] > 0 ? `${ratings[item.itemOrderId]} star${ratings[item.itemOrderId] !== 1 ? 's' : ''}` : 'Not rated'}
                    </span>
                  </div>
                  
                  {/* Review Textarea */}
                  <div className="mb-3">
                    <textarea
                      rows="2"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Share your experience..."
                      value={reviews[item.itemOrderId]}
                      onChange={(e) => handleReviewChange(item.itemOrderId, e.target.value)}
                    />
                  </div>
                  
                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => submitReview(item.itemOrderId)}
                      disabled={ratings[item.itemOrderId] === 0}
                      className={`px-3 py-1 text-sm rounded-md font-medium text-white ${ratings[item.itemOrderId] === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="p-5 bg-gray-50 border-t">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Delivery Address */}
          <div>
            <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Delivery Address
            </h4>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="font-medium">{Order_Address.name}</p>
              <p className="text-sm text-gray-600">{Order_Address.phone}</p>
              <p className="text-sm text-gray-600 mt-2">
                {Order_Address.street},<br />
                {Order_Address.city}, {Order_Address.state} - {Order_Address.zip}
              </p>
            </div>
          </div>

          {/* Payment Summary */}
          <div>
            <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Payment Summary
            </h4>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Payment Method:</span>
                <span className="text-sm font-medium">{PaymentMethod}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Payment Status:</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${paymentStatusStyles[PaymentStatus] || 'bg-gray-100 text-gray-800'}`}>
                  {PaymentStatus}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Delivery Charge:</span>
                <span className="text-sm font-medium">₹{DeliveryCharge}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-md font-semibold text-gray-800">Total Amount:</span>
                <span className="text-md font-bold text-gray-900">₹{TotalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Modal */}
      <Dialog open={isCancelModalOpen} onClose={closeCancelModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6">
            <Dialog.Title className="text-lg font-bold text-gray-900 mb-4">
              {selectedItemToCancel ? 'Cancel Item' : 'Cancel Order'}
            </Dialog.Title>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation
              </label>
              <select
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a reason</option>
                {cancellationReasons.map((reason, index) => (
                  <option key={index} value={reason}>{reason}</option>
                ))}
              </select>
            </div>

            {cancellationReason === 'Other reason' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Please specify
                </label>
                <textarea
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your reason here..."
                />
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeCancelModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Go Back
              </button>
              <button
                onClick={confirmCancel}
                disabled={!cancellationReason}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${!cancellationReason ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
              >
                Confirm Cancellation
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Order;