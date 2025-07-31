import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderSuccessPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Replace current history so user can’t go back
        window.history.replaceState(null, '', window.location.href);

        const handlePopState = () => {
            navigate('/', { replace: true }); // Always go to home on back
        };

        // Listen to back/forward navigation
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);


    const {currentPlaceOrder}=useSelector(state=>state.orders)
    const order=currentPlaceOrder
    const {
        orderId,
        Order_Address,
        Items,
        TotalAmount,
        DeliveryCharge,
        DeliveryDate,
        PaymentMethod,
        Status,
        OrderStatus,
        PaymentStatus,
    } = order;
    

    const formattedDate = new Date(DeliveryDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 text-center text-xl font-semibold">
                ✅ Order Placed Successfully!
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <p><strong>Order ID:</strong> {orderId}</p>
                <p><strong>Payment Method:</strong> {PaymentMethod}</p>
                <p><strong>Status:</strong> {Status}</p>
                <p><strong>Order Status:</strong> {OrderStatus}</p>
                <p><strong>Payment Status:</strong> {PaymentStatus}</p>
                <p><strong>Expected Delivery:</strong> {formattedDate}</p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                <p><strong>Name:</strong> {Order_Address.name}</p>
                <p><strong>Address Type:</strong> {Order_Address.addressType}</p>
                <p><strong>Phone:</strong> {Order_Address.phone}</p>
                <p><strong>Alternate Phone:</strong> {Order_Address.alternativePhone}</p>
                <p>
                    <strong>Full Address:</strong> {Order_Address.house}, {Order_Address.locality}, {Order_Address.city}, {Order_Address.state}, {Order_Address.country} - {Order_Address.pincode}
                </p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Ordered Items</h2>
                {Items.map((item) => (
                    <div key={item.itemOrderId} className="flex gap-4 border-b py-4">
                        <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex flex-col justify-between">
                            <p><strong>Product:</strong> {item.productName}</p>
                            <p><strong>Price:</strong> ₹{item.productPrice}</p>
                            <p><strong>Quantity:</strong> {item.quantity}</p>
                            <p><strong>Subtotal:</strong> ₹{item.subTotal}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Price Summary</h2>
                <p><strong>Items Total:</strong> ₹{TotalAmount}</p>
                <p><strong>Delivery Charges:</strong> ₹{DeliveryCharge}</p>
                <p className="text-lg font-semibold mt-2">
                    <strong>Total Amount:</strong> ₹{Number(TotalAmount) + Number(DeliveryCharge)}
                </p>
            </div>

            <div className="flex justify-center gap-4 mt-8">
                <button
                    onClick={() => navigate('/my-orders')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg"
                >
                    View My Orders
                </button>
                <button
                    onClick={() => navigate('/collection')}
                    className="bg-gray-800 hover:bg-gray-900 text-white font-medium px-6 py-2 rounded-lg"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
