import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllAddress } from "../../features/accountSettings/accountSlice";
import EditAddressModal from "../../components/common/EditAddress";
import CheckoutCard from "../../components/user/checkoutCard";
import { applyCoupon, removeCoupon } from "../../features/coupons/couponsSlice";

const Checkout = () => {
  const [step, setStep] = useState(2);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const location = useLocation();
  const total = location.state?.totalPrice || 0;
  const cartItems = location.state?.cartItems || [];
  console.log(cartItems, '---items to check')
  const shippingCost = location.state?.shippingCost || 0;

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Guest" };
  const { currency } = useSelector((state) => state.global);
  const { addresses } = useSelector((state) => state.account);
  useEffect(() => {
    if (!location.state || !cartItems || cartItems.length === 0) {
      navigate("/", { replace: true }); // Redirect to home
    }
  }, []);

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    dispatch(getAllAddress(user._id));
  }, [dispatch, user._id]);

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddr = addresses.find(
        (addr) => addr.defaultAddress === true,
      );
      if (defaultAddr) {
        setSelectedAddress(defaultAddr);
      } else if (addresses.length > 0) {
        setSelectedAddress(addresses[0]);
      }
    }
  }, [addresses]);

  const handleEdit = (addr) => {
    setSelectedAddress(addr);
    setEditModalOpen(true);
  };

  const handleContinue = () => {
    if (step === 2 && selectedAddress) {
      setStep(3);
    }
  };

  const handleApplyCoupon = async () => {
    setCouponError("");
    if (!couponCode) {
      return setCouponError("Please enter a coupon code");
    }

    try {
      const data = await dispatch(
        applyCoupon({ userId: user._id, couponCode }),
      ).unwrap();
      console.log("Coupon applied:", data);
      if (data.error) {
        return setCouponError(data.error);
      }

      let discountAmount = 0;

      if (data.coupon.discountType === "percentage") {
        discountAmount = (total * data.coupon.discountValue) / 100;
      } else if (data.coupon.discountType === "fixed") {
        discountAmount = data.coupon.discountValue;
      }
      if (discountAmount > total) {
        discountAmount = total; // Ensure discount does not exceed total
      }
      console.log("Discount amount:", discountAmount);
      setDiscount(discountAmount);
      setCouponApplied(true);
      setCouponError("");
    } catch (err) {
      setCouponError(err.message || "Failed to apply coupon");
    }
  };

  const handleRemoveCoupon = async () => {
    const res = await dispatch(removeCoupon({ userId: user._id, couponCode }));
    console.log("Coupon removed", res);
    if (res.type == "user/cart/removeCoupon/fulfilled") {
      setCouponCode("");
      setDiscount(0);
      setCouponApplied(false);
      setCouponError("");
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-10 p-6">
      <div className="flex justify-between items-center border-b-2 border-green-500 pb-3 mb-8">
        <h2 className="text-3xl font-bold text-green-700">
          CHECKOUT
        </h2>
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-md transition-all shadow-sm"
          onClick={() => {
            navigate(-1);
          }}
        >
          Back
        </button>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Checkout Steps */}
        <div className="lg:w-2/3">
          {/* Step 1: Login */}
          <div className="mb-8 p-5 bg-white rounded-lg shadow-sm border border-gray-100 opacity-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold mr-3">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  LOGIN {user && <span className="text-blue-600 ml-2">✔</span>}
                </h3>
              </div>
            </div>
            <p className="ml-11 mt-2 text-sm text-gray-700">
              Customer{" "}
              <span className="font-medium">name: {user.username}</span>
            </p>
          </div>

          {/* Step 2: Address */}
          <div className="mb-8 p-5 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold mr-3">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-800">ADDRESS</h3>
              </div>
              {step === 2 && selectedAddress && (
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-1 text-emerald-700 hover:text-emerald-900 text-sm"
                >
                  CHANGE
                </button>
              )}
            </div>

            {step === 2 && (
              <>
                <div className="space-y-4 mb-4">
                  {addresses?.length > 0 ? (
                    addresses.map((addr, index) => (
                      <div
                        key={addr._id || index}
                        className={`border-2 ${selectedAddress?._id === addr._id
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200"
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
                                <span className="font-medium text-gray-800">
                                  {addr.name}
                                </span>
                                {addr.defaultAddress && (
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                    DEFAULT
                                  </span>
                                )}
                                <span
                                  className={` ${addr.addressType === "home" ? "bg-blue-100 text-blue-800" : " bg-yellow-100 text-yellow-800"} text-xs px-2 py-0.5 rounded-full`}
                                >
                                  {addr.addressType}
                                </span>
                                <span className="text-gray-500 text-sm">
                                  {addr.phone}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 mt-2">
                                {addr.house},{addr.locality}, {addr.city},{" "}
                                {addr.state} - {addr.pincode}
                              </p>
                            </div>
                          </label>
                        </div>
                        <button
                          className="px-4 py-1 bg-white text-emerald-700 rounded-md border border-emerald-700 hover:bg-emerald-50 text-sm shadow-sm ml-4"
                          onClick={() => {
                            handleEdit(addr);
                          }}
                        >
                          EDIT
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600 ml-11">
                      No addresses found. Please add a new address.
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 ml-11">
                  <button
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 font-medium shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!selectedAddress}
                    onClick={handleContinue}
                  >
                    CONTINUE
                  </button>

                  <button
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center font-medium"
                    onClick={() => {
                      navigate("/add-address-checkout")
                    }}
                  >
                    <span className="text-xl mr-1">+</span> Add a new address
                  </button>
                </div>
              </>
            )}

            {step > 2 && selectedAddress && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">
                      {selectedAddress.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedAddress.phone}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedAddress.house}, {selectedAddress.locality},
                      {selectedAddress.city}, {selectedAddress.state} -{" "}
                      {selectedAddress.pincode}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Order Summary */}
          {step >= 3 && (
            <div className="mb-8 p-5 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold mr-3">
                    3
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    ORDER SUMMARY
                  </h3>
                </div>
                {step === 3 && (
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-1 text-emerald-700 hover:text-emerald-900 text-sm"
                  >
                    CHANGE
                  </button>
                )}
              </div>

              <div className="mt-4">
                {cartItems.map((item) => {
                  return (
                    <CheckoutCard
                      key={item._id}
                      productName={item.productId.name}
                      deliveryDate={formattedDeliveryDate}
                      price={item.productId.price}
                      imageUrl={item.productId.images[0]}
                      quantity={item.quantity}
                    />
                  );
                })}
              </div>

              {step === 3 && (
                <div className="mt-6 flex justify-end">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium shadow-md"
                    onClick={() => {
                      navigate("/payment-page", {
                        state: {
                          address: selectedAddress,
                          cartItems: cartItems,
                          totalPrice: total,
                          discount: discount,
                          shippingCost: shippingCost,
                          userId: user._id,
                          deliveryDate: formattedDeliveryDate,
                        },
                      });
                    }}
                  >
                    PLACE ORDER
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Price Details */}
        <div className="lg:w-1/3">
          <div className="sticky top-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 mb-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                PRICE DETAILS
              </h4>
              {/* Coupon Apply Section */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apply Coupon
                </label>
                {couponApplied ? (
                  <div className="flex items-center justify-between bg-green-100 border border-green-300 text-green-800 text-sm p-2 rounded">
                    <span>
                      Coupon <strong>{couponCode}</strong> applied
                    </span>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-red-600 font-medium hover:underline text-sm ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                      placeholder="Enter coupon code"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium shadow"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-red-600 text-xs mt-1">{couponError}</p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>SubTotal</span>
                  <span>
                    {currency}
                    {total - shippingCost}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Delivery Charges</span>
                  {shippingCost ? (
                    `${currency}${shippingCost}`
                  ) : (
                    <span className="text-green-600 font-medium">FREE</span>
                  )}
                </div>
              </div>
              <hr className="my-4 border-gray-200" />
              <div className="flex justify-between text-sm text-gray-700">
                <span>Discount</span>
                <span className="text-green-700">
                  - {currency}
                  {discount}
                </span>
              </div>

              <div className="flex justify-between text-lg font-bold text-gray-800 mt-1">
                <span>Total Payable</span>
                <span>
                  {currency}
                  {Math.max(0, total - discount)}
                </span>
              </div>
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
