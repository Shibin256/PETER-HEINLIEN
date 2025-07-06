import React, { useState } from 'react';
import GenericTable from '../../components/admin/GenericTable';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getOrders } from '../../features/orders/ordersSlice';

const OrdersList = () => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    dispatch(getOrders(user._id));
  }, [dispatch, user._id]);

  const { orders } = useSelector((state) => state.orders);

  // State to track which order's products are being viewed
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  // Function to handle status change
  const changeStatus = (orderId, newStatus) => {
    // You'll need to implement this with your API
    console.log(`Changing status for order ${orderId} to ${newStatus}`);
  };

  // Function to verify return
  const verifyReturn = (orderId) => {
    // You'll need to implement this with your API
    console.log(`Verifying return for order ${orderId}`);
  };

  // Function to toggle product view
  const toggleProducts = (orderId) => {
    setSelectedOrderId(selectedOrderId === orderId ? null : orderId);
    setOrderDetails(null);
  };

  // Function to show order details
  const showDetails = (order) => {
    setOrderDetails(order);
    setSelectedOrderId(null);
  };

  // Define columns for GenericTable
  const columns = [
    { key: 'orderId', label: 'Order ID' },
    {
      key: 'Order_Address',
      label: 'Customer',
      render: (address) => address?.name || 'N/A'
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      key: 'TotalAmount',
      label: 'Total',
      render: (amount) => `₹${amount?.toFixed(2) || '0.00'}`
    },
    // {
    //   key: 'Status',
    //   label: 'Status',
    //   render: (status, item) => (
    //     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
    //       status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
    //       status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
    //       status === 'Delivered' ? 'bg-green-100 text-green-800' :
    //       status === 'Cancelled' ? 'bg-red-100 text-red-800' :
    //       'bg-gray-100 text-gray-800'
    //     }`}>
    //       {status}
    //     </span>
    //   ),
    // },
    {
      key: 'OrderStatus',
      label: 'Order Status',
      render: (status) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
            status === 'Completed' ? 'bg-blue-100 text-blue-800' :
              status === 'Delivered' ? 'bg-green-100 text-green-800' :
                status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
          }`}>
          {status}
        </span>
      ),
    },
    {
      key: 'PaymentStatus',
      label: 'Payment',
      render: (status) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status === 'Paid' ? 'bg-green-100 text-green-800' :
          status === 'Unpaid' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
          {status}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, item) => (
        <div className="flex space-x-2">
          <button
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            onClick={() => toggleProducts(item._id)}
          >
            {selectedOrderId === item._id ? 'Hide Items' : 'Items'}
          </button>
          <button
            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
            onClick={() => showDetails(item)}
          >
            Details
          </button>
        </div>
      ),
    },
  ];

  // Render actions for each row
  const renderActions = (item) => (
    <div className="flex justify-end">
      {item.OrderStatus === 'Processing' && (
        <div className="flex space-x-2">
          <button
            onClick={() => changeStatus(item._id, 'Shipped')}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors"
          >
            Mark Shipped
          </button>
        </div>
      )}
      {item.OrderStatus === 'Shipped' && (
        <button
          onClick={() => changeStatus(item._id, 'Delivered')}
          className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded transition-colors"
        >
          Mark Delivered
        </button>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Order Management</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <GenericTable
          title="All Orders"
          columns={columns}
          data={orders}
          renderActions={renderActions}
        />

        {/* Expanded product details */}
        {selectedOrderId && (
          <div className="bg-gray-50 px-6 py-4 border-t">
            <h3 className="font-semibold text-gray-700 mb-3">Order Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders
                    .find(order => order._id === selectedOrderId)
                    ?.Items?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.productName}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {item.productImage?.length > 0 && (
                            <img
                              src={item.productImage[0]}
                              alt={item.productName}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">₹{item.productPrice?.toFixed(2)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.quantity || 1}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">₹{item.subTotal?.toFixed(2)}</td>
                      </tr>
                    ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" className="px-4 py-3 text-right font-medium">Delivery Charge:</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      ₹{orders.find(order => order._id === selectedOrderId)?.DeliveryCharge || '0.00'}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="4" className="px-4 py-3 text-right font-medium">Total:</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900">
                      ₹{orders.find(order => order._id === selectedOrderId)?.TotalAmount?.toFixed(2) || '0.00'}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Order details modal */}
        {orderDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-gray-800">Order Details - {orderDetails.orderId}</h2>
                  <button
                    onClick={() => setOrderDetails(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Customer Information</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p><span className="font-medium">Name:</span> {orderDetails.Order_Address?.name}</p>
                      <p><span className="font-medium">Phone:</span> {orderDetails.Order_Address?.phone}</p>
                      <p><span className="font-medium">Order Date:</span> {new Date(orderDetails.createdAt).toLocaleString(undefined, {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}</p>
                      <p><span className="font-medium">Delivery Date:</span> {orderDetails.DeliveryDate ? new Date(orderDetails.DeliveryDate).toLocaleString(undefined, {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        // hour: '2-digit',
                        // minute: '2-digit',
                        // hour12: true
                      }) : 'Not specified'}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Order Status</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      {/* <div className="flex justify-between">
                        <span className="font-medium">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${orderDetails.Status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                            orderDetails.Status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                              orderDetails.Status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                orderDetails.Status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                          }`}>
                          {orderDetails.Status}
                        </span>
                      </div> */}
                      <div className="flex justify-between">
                        <span className="font-medium">Order Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${orderDetails.OrderStatus === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                            orderDetails.OrderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                              orderDetails.OrderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                                orderDetails.OrderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                          }`}>
                          {orderDetails.OrderStatus}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Payment:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${orderDetails.PaymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                          orderDetails.PaymentStatus === 'Unpaid' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                          {orderDetails.PaymentStatus} ({orderDetails.PaymentMethod})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Shipping Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">{orderDetails.Order_Address?.house}, {orderDetails.Order_Address?.locality}</p>
                    <p>{orderDetails.Order_Address?.city}, {orderDetails.Order_Address?.state}</p>
                    <p>{orderDetails.Order_Address?.country} - {orderDetails.Order_Address?.pincode}</p>
                    {orderDetails.Order_Address?.alternativePhone && (
                      <p className="mt-2"><span className="font-medium">Alt. Phone:</span> {orderDetails.Order_Address.alternativePhone}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Order Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {orderDetails.Items?.map((item, index) => (
                      <div key={index} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                        <div className="flex items-center">
                          {item.productImage?.length > 0 && (
                            <img
                              src={item.productImage[0]}
                              alt={item.productName}
                              className="w-10 h-10 object-cover rounded mr-3"
                            />
                          )}
                          <div>
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-gray-500">{item.quantity || 1} × ₹{item.productPrice?.toFixed(2)}</p>
                          </div>
                        </div>
                        <p className="font-medium">₹{item.subTotal?.toFixed(2)}</p>
                      </div>
                    ))}
                    <div className="flex justify-between pt-3 mt-2 border-t border-gray-200">
                      <p>Subtotal</p>
                      <p>₹{(orderDetails.TotalAmount - (orderDetails.DeliveryCharge || 0)).toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between py-1">
                      <p>Delivery Charge</p>
                      <p>₹{orderDetails.DeliveryCharge || '0.00'}</p>
                    </div>
                    <div className="flex justify-between pt-2 mt-1 border-t border-gray-200 font-bold">
                      <p>Total</p>
                      <p>₹{orderDetails.TotalAmount?.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                <button
                  onClick={() => setOrderDetails(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Close
                </button>
                {orderDetails.Status === 'Processing' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        changeStatus(orderDetails._id, 'Shipped');
                        setOrderDetails(null);
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium text-white"
                    >
                      Mark Shipped
                    </button>
                    {/* <button
                      onClick={() => {
                        changeStatus(orderDetails._id, 'Cancelled');
                        setOrderDetails(null);
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium text-white"
                    >
                      Cancel Order
                    </button> */}
                  </div>
                )}
                {orderDetails.Status === 'Shipped' && (
                  <button
                    onClick={() => {
                      changeStatus(orderDetails._id, 'Delivered');
                      setOrderDetails(null);
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm font-medium text-white"
                  >
                    Mark Delivered
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersList;