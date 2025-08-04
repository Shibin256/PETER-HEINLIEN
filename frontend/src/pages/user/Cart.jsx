import React, { useState } from "react";
import Title from "../../components/common/Title";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchCart,
  removeFromCart,
  updateCart,
} from "../../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Cart = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCart(user._id));
    }
  }, []);

  const { cartItems = [] } = useSelector((state) => state.cart);
  const [localCart, setLocalCart] = useState([]);

  useEffect(() => {
    setLocalCart(cartItems);
  }, [cartItems]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 1000 ? 0 : 50;
  const [total, setTotal] = useState(subtotal + shipping);
  useEffect(() => {
    setTotal(subtotal + shipping);
  }, [subtotal, shipping]);
  const { currency } = useSelector((state) => state.global);

  const handleQuantityChange = (productId, delta) => {
    const item = localCart.find((item) => item.productId._id === productId);
    const newQuantity = Math.max(1, item.quantity + delta);

    if (delta > 0 && newQuantity > item.productId.totalQuantity) {
      console.warn(
        `Only ${item.productId.totalQuantity} items available in stock.`,
      );
      return;
    }

    if (item.quantity === 4 && delta > 0) {
      console.warn("Max quantity reached");
      return;
    }

    setLocalCart((prev) =>
      prev.map((item) =>
        item.productId._id === productId
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );

    dispatch(
      updateCart({
        userId: user._id,
        productId,
        quantity: newQuantity,
      }),
    )
      .unwrap()
      .then(() => dispatch(fetchCart(user._id)))
      .catch((err) => console.error("Cart update failed:", err));
  };

  const handleRemoveItem = async (id, quantity) => {
    await dispatch(
      removeFromCart({
        userId: user._id,
        productId: id,
        itemQuantity: { quantity: quantity },
      }),
    );
    dispatch(fetchCart(user._id));
  };

  const handleProceedToCheckout = async () => {
    navigate("/checkout", {
      state: {
        cartItems: localCart,
        totalPrice: total,
        shippingCost: shipping,
        userId: user._id,
      },
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <Title text1={"Your"} text2={"Shopping Cart"} />
        <div className="bg-white rounded-lg shadow-md p-12 mt-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="text-xl font-medium text-gray-900 mt-4">
            Your cart is empty
          </h3>
          <p className="text-gray-600 mt-2">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/collection"
            className="mt-6 inline-block bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-md font-medium transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 py-4">
      <Title text1={"Your"} text2={"Shopping Cart"} />
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items - Wider Table */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-48">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-32">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-40">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-32">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {localCart.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              handleRemoveItem(
                                item.productId._id,
                                item.quantity,
                              )
                            }
                            className="text-gray-400 hover:text-red-500 transition-colors mr-4"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <div className="flex-shrink-0 h-20 w-20 bg-gray-100 rounded-md overflow-hidden">
                            <img
                              src={
                                item?.productId?.images?.[0] ||
                                "/default-image.jpg"
                              }
                              alt={item?.productId?.name || "Product Image"}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-sm text-gray-900">
                        {item?.productId?.name}
                      </td>
                      <td className="px-6 py-6 text-sm text-gray-900">
                        {currency}
                        {item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.productId._id, -1)
                            }
                            className="text-gray-500 hover:text-teal-600 transition-colors p-1"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 12H4"
                              />
                            </svg>
                          </button>
                          <span className="mx-3 text-base w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.productId._id, 1)
                            }
                            className={`text-gray-500 hover:text-teal-600 transition-colors p-1 ${
                              item.quantity >= 4 ||
                              item.quantity >= item.productId.totalQuantity
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={
                              item.quantity >= 4 ||
                              item.quantity >= item.productId.totalQuantity
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-sm font-medium text-gray-900">
                        {currency}
                        {(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Cart Totals
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  {currency}
                  {subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0
                    ? "Free"
                    : `${currency}${shipping.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between pt-3">
                <span className="text-lg font-medium">Total</span>
                <span className="text-lg font-bold text-teal-600">
                  {currency}
                  {total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-md font-medium transition-colors shadow-md hover:shadow-lg"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
