import React, { useState } from 'react';
import Title from '../../components/common/Title';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchCart, removeFromCart, updateCart } from '../../features/cart/cartSlice';

const Cart = () => {

  const user = JSON.parse(localStorage.getItem('user'))
  const dispatch = useDispatch()

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCart(user._id));
    }
  }, [])

  const { cartItems = [] } = useSelector(state => state.cart)
  const [localCart, setLocalCart] = useState([]);
  console.log(localCart, '---------+++++++')

  useEffect(() => {
    setLocalCart(cartItems);
  }, [cartItems]);


  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + shipping;
  const { currency } = useSelector(state => state.global)

  const handleQuantityChange = (productId, delta) => {

    const item = localCart.find(item => item.productId._id === productId);
    const newQuantity = Math.max(1, item.quantity + delta);


    if (item.quantity === 4 && delta > 0) {
      console.warn("Max quantity reached");
      return;
    }

    setLocalCart(prev =>
      prev.map(item =>
        item.productId._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    // Dispatch to update backend
    dispatch(updateCart({
      userId: user._id,
      productId,
      quantity: newQuantity
    }))
      .unwrap()
      .then(() => dispatch(fetchCart(user._id))) // Refresh cart after update
      .catch(err => console.error('Cart update failed:', err));
  };



  const handleRemoveItem = async (id) => {
    await dispatch(removeFromCart({ userId: user._id, productId: id }))
    dispatch(fetchCart(user._id));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* <h2 className="text-3xl font-light text-teal-800 border-b-2 border-teal-200 pb-4 mb-8">Your Shopping Cart</h2> */}
      <Title text1={'Your'} text2={'Shopping Cart'} />
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {localCart.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button
                          onClick={() => handleRemoveItem(item.productId._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors mr-3"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={item?.productId?.images?.[0] || '/default-image.jpg'}
                            alt={item?.name || 'Product Image'}
                            className="h-full w-full object-cover"
                          />

                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">SKU: {item.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {currency}{item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button
                          onClick={() => handleQuantityChange(item.productId._id, -1)}
                          className="text-gray-500 hover:text-teal-600 transition-colors p-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="mx-2 text-sm w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.productId._id, 1)}
                          className="text-gray-500 hover:text-teal-600 transition-colors p-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {currency}{(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="flex-grow flex">
              <input
                type="text"
                placeholder="Coupon code"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-r-md transition-colors">
                Apply Coupon
              </button>
            </div>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors">
              Update Cart
            </button>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cart Totals</h3>

            <div className="space-y-3">
              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{currency}{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? 'Free' : `${currency}${shipping.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between pt-3">
                <span className="text-lg font-medium">Total</span>
                <span className="text-lg font-bold text-teal-600">{currency}{total.toFixed(2)}</span>
              </div>
            </div>

            <button className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-md font-medium transition-colors shadow-md hover:shadow-lg">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;