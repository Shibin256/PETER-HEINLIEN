import React, { useState } from 'react';
import GenericTable from '../../components/admin/GenericTable';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { changeOrderStatus, fetchAllOrders, retrunVerify, singleCancelVerify, verifyCancel } from '../../features/orders/ordersSlice';
import AuthInput from '../../components/common/AuthInput';

const OrdersList = () => {
  const dispatch = useDispatch();
  const [sortType, setSortType] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showReturnVerifyModal, setShowReturnVerifyModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [selectedReturnItem, setSelectedReturnItem] = useState(null);
  const [selectedCancelItem, setSelectedCancelItem] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showCancelVerifyModal, setShowCancelVerifyModal] = useState(false);



  useEffect(() => {
    if (sortType) {
      dispatch(fetchAllOrders({ search: '', page: 1, limit: 10, sort: sortType }));
    } else {
      dispatch(fetchAllOrders({ page: 1, limit: 10 }));
    }
  }, [dispatch, sortType]);

  const { orders, page, totalPage } = useSelector((state) => state.orders);

  const changeStatus = async (orderId, newStatus) => {
    try {
      const res = await dispatch(changeOrderStatus({ itemOrderId: orderId, data: { status: newStatus } }));
      if (res.meta.requestStatus === 'fulfilled') {
        dispatch(fetchAllOrders({ page: 1, limit: 10 }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleVerifyReturn = async (orderId, itemId) => {
    try {
      await dispatch(retrunVerify({ itemOrderId: itemId }));
      setShowReturnVerifyModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleVerifySingleCancel = async (orderId, itemId) => {
    try {
      await dispatch(singleCancelVerify({ itemOrderId: itemId }));
      setShowCancelVerifyModal(false);
    } catch (error) {
      console.log(error);
    }
  };


  const handleSearch = async (e) => {
    e.preventDefault();
    dispatch(fetchAllOrders({ search: searchTerm, page: 1, limit: 10 }));
  };

  const handleVerifyCancel = async (itemOrderId) => {
    try {
      console.log(itemOrderId)
      const res = await dispatch(verifyCancel(itemOrderId)).then((res) => {
        console.log(res, 'resssss')
        if (res.type === 'user/verifyCancel/fulfilled') {
          console.log('orders')
          dispatch(fetchAllOrders({ page: 1, limit: 10 }))
        }
      })
      setShowVerifyModal(false);
    } catch (error) {
      console.log(error)
    }
  };


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
    {
      key: 'OrderStatus',
      label: 'Order Status',
      render: (status, item) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
          status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
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
            onClick={() => setSelectedOrderId(item._id === selectedOrderId ? null : item._id)}
          >
            {item._id === selectedOrderId ? 'Hide Items' : 'Items'}
          </button>
          <button
            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
            onClick={() => setOrderDetails(item)}
          >
            Details
          </button>
        </div>
      ),
    },
  ];

  const renderActions = (item) => (
    <div className="flex justify-end">
      {item.OrderStatus === 'Processing' && (
        <button
          onClick={() => changeStatus(item.orderId, 'Shipped')}
          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors"
        >
          Mark Shipped
        </button>
      )}
      {item.OrderStatus === 'Shipped' && (
        <button
          onClick={() => changeStatus(item.orderId, 'Delivered')}
          className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded transition-colors"
        >
          Mark Delivered
        </button>
      )}

      {item.OrderStatus === 'Delivered' && item.Items.some(i => i.returnReason && !i.returnVerified) && (
        <button
          onClick={() => {
            setCurrentOrder(item);
            setSelectedReturnItem(item.Items.find(i => i.returnReason && !i.returnVerified));
            setShowReturnVerifyModal(true);
          }}
          className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded transition-colors"
        >
          Verify Return
        </button>
      )}


      {item.OrderStatus !== 'Cancelled' && item.Items.some(i => i.cancelReason && !i.cancelVerified) && (
        <button
          onClick={() => {
            setCurrentOrder(item);
            setSelectedCancelItem(item.Items.find(i => i.cancelReason && !i.cancelVerified));
            setShowCancelVerifyModal(true);
          }}
          className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded transition-colors"
        >
          Verify cancel
        </button>
      )}


      {item.OrderStatus === 'Cancelled' && (
        <button
          onClick={() => {
            setCurrentOrder(item);
            setShowVerifyModal(true);
          }}
          disabled={item.cancelVerified}
          className={`px-3 py-1 text-white text-sm rounded transition-colors
      ${item.cancelVerified ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'}`}
        >
          {item.cancelVerified ? 'Verified' : 'Verify Cancel'}
        </button>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Order Management</h1>

      {/* Search and Sort */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2 w-full md:w-auto">
          <AuthInput
            type="text"
            name="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search orders by name..."
            width="w-full"
            Textcolor="text-gray-700"
            borderColor="border-gray-300"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap"
          >
            Search
          </button>
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                dispatch(fetchAllOrders({ page: 1, limit: 10 }));
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 whitespace-nowrap"
            >
              Clear
            </button>
          )}
        </form>

        <div className="relative w-full md:w-auto">
          <label className="absolute -top-2 left-3 px-1 text-xs font-medium text-gray-500 bg-white">
            Sort by
          </label>
          <select
            onChange={(e) => setSortType(e.target.value)}
            value={sortType}
            className="appearance-none px-4 py-2 pr-8 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm hover:border-gray-400 w-full"
          >
            <option value="">None</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <GenericTable
          title="All Orders"
          columns={columns}
          data={orders}
          renderActions={renderActions}
        />

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={page <= 1}
            onClick={() => dispatch(fetchAllOrders({ page: page - 1, limit: 10, search: searchTerm }))}
            className={`px-4 py-2 rounded ${page <= 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
          >
            Previous
          </button>

          <span className="text-sm text-gray-700">
            Page {page} of {totalPage}
          </span>

          <button
            disabled={page >= totalPage}
            onClick={() => dispatch(fetchAllOrders({ page: page + 1, limit: 10, search: searchTerm }))}
            className={`px-4 py-2 rounded ${page >= totalPage ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
          >
            Next
          </button>
        </div>

        {/* Order Items */}
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
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.find(order => order._id === selectedOrderId)?.Items?.map((item, index) => (
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
                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.returnReason ? (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.returnVerified ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                            {item.returnVerified ? 'Return Verified' : 'Return Requested'}
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            No Return
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
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
                      <p><span className="font-medium">Order Date:</span> {new Date(orderDetails.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Order Status</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
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
                          'bg-red-100 text-red-800'
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
                    <p>{orderDetails.Order_Address?.house},{orderDetails.Order_Address?.locality}, {orderDetails.Order_Address?.city}</p>
                    <p>{orderDetails.Order_Address?.state} - {orderDetails.Order_Address?.pincode}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Order Items</h3>
                  <div className="space-y-4">
                    {orderDetails.Items?.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start">
                          {item.productImage?.length > 0 && (
                            <img
                              src={item.productImage[0]}
                              alt={item.productName}
                              className="w-16 h-16 object-cover rounded mr-4"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium">{item.productName}</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                              <div>Price: ₹{item.productPrice?.toFixed(2)}</div>
                              <div>Qty: {item.quantity}</div>
                              <div>Subtotal: ₹{item.subTotal?.toFixed(2)}</div>
                              <div>
                                Return Status: {item.returnReason ? (
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.returnVerified ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                                    }`}>
                                    {item.returnVerified ? 'Return Verified' : 'Return Requested'}
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    No Return
                                  </span>
                                )}
                              </div>
                              <div>
                                  Cancel Status: {item.cancelReason ? (
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.cancelVerified ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                                    }`}>
                                    {item.cancelVerified ? 'Cancel Verified' : 'Cancel Requested'}
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    No Return
                                  </span>
                                )}
                              </div>
                            </div>
                            {item.returnReason && (
                              <div className="mt-2">
                                <p className="text-sm font-medium">Return Reason:</p>
                                <p className="text-sm text-gray-600">{item.returnReason}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        {item.returnReason && !item.returnVerified && (
                          <div className="mt-3 flex justify-end">
                            <button
                              onClick={() => {
                                setCurrentOrder(orderDetails);
                                setSelectedReturnItem(item);
                                setShowReturnVerifyModal(true);
                              }}
                              className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded"
                            >
                              Verify Return
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between py-2">
                    <span>Subtotal:</span>
                    <span>₹{(orderDetails.TotalAmount - (orderDetails.DeliveryCharge || 0)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Delivery Charge:</span>
                    <span>₹{orderDetails.DeliveryCharge || '0.00'}</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold border-t border-gray-200 mt-2 pt-2">
                    <span>Total:</span>
                    <span>₹{orderDetails.TotalAmount?.toFixed(2)}</span>
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
                {orderDetails.OrderStatus === 'Processing' && (
                  <button
                    onClick={() => {
                      changeStatus(orderDetails.orderId, 'Shipped');
                      setOrderDetails(null);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium text-white"
                  >
                    Mark Shipped
                  </button>
                )}
                {orderDetails.OrderStatus === 'Shipped' && (
                  <button
                    onClick={() => {
                      changeStatus(orderDetails.orderId, 'Delivered');
                      setOrderDetails(null);
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm font-medium text-white"
                  >
                    Mark Delivered
                  </button>
                )}
                {orderDetails.OrderStatus === 'Cancelled' && !orderDetails.cancelVerified && (
                  <button
                    onClick={() => {
                      setCurrentOrder(orderDetails);
                      setShowVerifyModal(true);
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium text-white"
                  >
                    Verify Cancel
                  </button>
                )}
                {orderDetails.OrderStatus === 'Cancelled' && orderDetails.cancelVerified && (
                  <button
                    disabled
                    className="px-4 py-2 bg-gray-500 text-white rounded-md text-sm font-medium cursor-default"
                  >
                    Verified
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Return Verification Modal */}
        {showCancelVerifyModal && currentOrder && selectedCancelItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Verify Return</h2>

                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Product:</h3>
                  <div className="flex items-center">
                    {selectedCancelItem.productImage?.length > 0 && (
                      <img
                        src={selectedCancelItem.productImage[0]}
                        alt={selectedCancelItem.productName}
                        className="w-16 h-16 object-cover rounded mr-3"
                      />
                    )}
                    <div>
                      <p className="font-medium">{selectedCancelItem.productName}</p>
                      <p className="text-sm text-gray-600">₹{selectedCancelItem.productPrice?.toFixed(2)} × {selectedCancelItem.quantity}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Return Reason:</h3>
                  <p className="bg-gray-50 p-3 rounded-md">{selectedCancelItem.returnReason}</p>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Refund Amount:</h3>
                  <p className="text-lg font-bold">₹{selectedCancelItem.subTotal?.toFixed(2)}</p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Please confirm that you have received the returned item in good condition before verifying this return.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowCancelVerifyModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleVerifySingleCancel(currentOrder._id, selectedCancelItem.itemOrderId)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm font-medium text-white"
                >
                  Confirm Return
                </button>
              </div>
            </div>
          </div>
        )}



        {/* Single Cancel Verification Modal */}
        {showReturnVerifyModal && currentOrder && selectedReturnItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Verify Return</h2>

                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Product:</h3>
                  <div className="flex items-center">
                    {selectedReturnItem.productImage?.length > 0 && (
                      <img
                        src={selectedReturnItem.productImage[0]}
                        alt={selectedReturnItem.productName}
                        className="w-16 h-16 object-cover rounded mr-3"
                      />
                    )}
                    <div>
                      <p className="font-medium">{selectedReturnItem.productName}</p>
                      <p className="text-sm text-gray-600">₹{selectedReturnItem.productPrice?.toFixed(2)} × {selectedReturnItem.quantity}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Return Reason:</h3>
                  <p className="bg-gray-50 p-3 rounded-md">{selectedReturnItem.returnReason}</p>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Refund Amount:</h3>
                  <p className="text-lg font-bold">₹{selectedReturnItem.subTotal?.toFixed(2)}</p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Please confirm that you have received the returned item in good condition before verifying this return.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowReturnVerifyModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleVerifyReturn(currentOrder._id, selectedReturnItem.itemOrderId)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm font-medium text-white"
                >
                  Confirm Return
                </button>
              </div>
            </div>
          </div>
        )}

        {showVerifyModal && currentOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Verify Cancellation</h2>
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Cancellation Reason:</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p>{currentOrder.cancelReason || 'No reason provided'}</p>
                  </div>
                </div>
                <p className="text-gray-600">Are you sure you want to verify this cancellation?</p>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowVerifyModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleVerifyCancel(currentOrder?.orderId)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium text-white"
                >
                  Confirm Verify
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrdersList;