import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  createPaymentOrder,
  verifyPayment,
} from '../../features/orders/ordersSlice';
import { toast } from 'react-toastify';

const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

const RetryPayment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isProcessing, setIsProcessing] = useState(false);

  const {
    orderId,
    address,
    cartItems,
    totalPrice,
    shippingCost,
    userId,
    deliveryDate,
  } = location.state || {};

  const totalAmount = Number(totalPrice) + Number(shippingCost || 0);

  // redirect if page opened directly
  useEffect(() => {
    if (!location.state || !orderId) {
      navigate('/cart', { replace: true });
    }
  }, []);

  // load razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);

      const result = await dispatch(createPaymentOrder(totalAmount)).unwrap();

      const { order } = result;

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: 'Peter Heinlien Watches',
        description: 'Retry Order Payment',
        order_id: order.id,

        handler: async function (response) {
          try {
            const verifyRes = await dispatch(
              verifyPayment({
                paymentDetails: response,
                orderId: orderId,
              })
            ).unwrap();

            if (verifyRes.success) {
              toast.success('Payment Successful');

              navigate('/my-orders');
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            console.error(error);
            toast.error('Payment verification error');
          }
        },

        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled');
          },
        },

        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response) {
        toast.error(
          response.error?.description || 'Payment failed. Please try again.'
        );
      });

      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error('Unable to start payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-sm">
      <h2 className="text-3xl font-bold text-green-700 mb-6 border-b pb-3">
        Retry Payment
      </h2>

      {/* Order Summary */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Order Summary</h3>

        <div className="flex justify-between py-2">
          <span>Items</span>
          <span>{cartItems?.length}</span>
        </div>

        <div className="flex justify-between py-2">
          <span>Items Total</span>
          <span>₹{totalPrice}</span>
        </div>

        <div className="flex justify-between py-2">
          <span>Delivery</span>
          <span>{shippingCost ? `₹${shippingCost}` : 'FREE'}</span>
        </div>

        <div className="border-t my-2"></div>

        <div className="flex justify-between py-2 font-bold text-lg">
          <span>Total Payable</span>
          <span>₹{totalAmount}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => navigate('/my-orders')}
          className="px-6 py-2 border rounded-md hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          {isProcessing ? 'Processing...' : 'Retry Payment'}
        </button>
      </div>
    </div>
  );
};

export default RetryPayment;
