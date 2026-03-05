import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllAddress } from "../../features/accountSettings/accountSlice";
import EditAddressModal from "../../components/common/EditAddress";
import CheckoutCard from "../../components/user/CheckoutCard";
import {
  applyCoupon,
  removeCoupon,
  fetchUserCoupons,
} from "../../features/coupons/couponsSlice";
import { fetchCart } from "../../features/cart/cartSlice";
import { toast } from "react-toastify";
import { RiCouponLine } from "react-icons/ri";

const Checkout = () => {
  const [step, setStep] = useState(2);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showCouponDropdown, setShowCouponDropdown] = useState(false);
  const location = useLocation();
  const from = location.state?.from || false;
  const shippingCost = location.state?.shippingCost || 0;

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Guest" };
  const { currency } = useSelector((state) => state.global);
  const { addresses } = useSelector((state) => state.account);
  const { userCoupons = [] } = useSelector((state) => state.coupons);
  console.log(userCoupons, "-----");

  // Fetch user coupons on component mount
  useEffect(() => {
    if (user?._id) {
      dispatch(fetchUserCoupons());
    }
  }, [dispatch, user?._id]);

  useEffect(() => {
    if (!location.state || !cartItems || cartItems.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, []);

  useEffect(() => {
    dispatch(fetchCart(user._id));
  }, [dispatch, user._id]);

  let { cartItems = [] } = useSelector((state) => state.cart);

  if (from) {
    cartItems = location.state?.cartItems || [];
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const [total, setTotal] = useState(subtotal + shippingCost);


  useEffect(() => {
    if (from) {
      setTotal(location.state?.totalPrice || 0);
    }
  }, [from, location.state?.totalPrice]);

  // Filter available coupons based on cart subtotal
  const availableCoupons =
    userCoupons?.filter((coupon) => {
      const isActive = new Date(coupon.expiresAt) > new Date();
      const notUsed = !coupon.usersUsed?.includes(user?._id);
      const withinLimit = coupon.usersUsed?.length < coupon.usageLimit;
      const meetsMinOrder = coupon.minOrderAmount <= subtotal;
      return isActive && notUsed && withinLimit && meetsMinOrder;
    }) || [];

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


  const calculateDiscount = (coupon, amount) => {
    if (!coupon) return 0;

    let discountAmount = 0;

    if (coupon.discountType === "percentage") {
      discountAmount = (amount * coupon.discountValue) / 100;

      // apply max discount limit
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.discountType === "fixed") {
      discountAmount = coupon.discountValue;
    }

    // ensure discount never exceeds order amount
    return Math.min(discountAmount, amount);
  };

  const handleApplyCoupon = async (coupon) => {
    setCouponError("");

    try {
      const discountAmount = calculateDiscount(coupon, total);

      // Check if coupon is applicable
      if (total < coupon.minOrderAmount) {
        toast.error(
          `Minimum order amount for this coupon is ${currency}${coupon.minOrderAmount}`,
        );
        return;
      }

      const data = await dispatch(
        applyCoupon({
          userId: user._id,
          couponCode: coupon.code,
          subtotal: total,
        }),
      ).unwrap();

      if (data.error) {
        return setCouponError(data.error);
      }

      setDiscount(discountAmount);
      setAppliedCoupon(coupon);
      setCouponCode(coupon.code);
      setShowCouponDropdown(false);
      toast.success(`Coupon ${coupon.code} applied successfully!`);
    } catch (err) {
      setCouponError(err.message || "Failed to apply coupon");
    }
  };

  const handleRemoveCoupon = async () => {
    if (appliedCoupon) {
      const res = await dispatch(
        removeCoupon({
          userId: user._id,
          couponCode: appliedCoupon.code,
        }),
      );

      if (res.type === "user/cart/removeCoupon/fulfilled") {
        setCouponCode("");
        setDiscount(0);
        setAppliedCoupon(null);
        toast.info("Coupon removed");
      }
    }
  };

  const handleEdit = (addr) => {
    setSelectedAddress(addr);
    setEditModalOpen(true);
  };

  const handleContinue = () => {
    if (step === 2 && selectedAddress) {
      setStep(3);
    }
  };

  const finalTotal = Math.max(0, total - discount);

  return (
    <div className="max-w-6xl mx-auto my-10 p-6">
      <div className="flex justify-between items-center border-b-2 border-green-500 pb-3 mb-8">
        <h2 className="text-3xl font-bold text-green-700">CHECKOUT</h2>
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-md transition-all shadow-sm"
          onClick={() => {
            navigate("/cart");
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
                        className={`border-2 ${
                          selectedAddress?._id === addr._id
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
                      navigate("/add-address-checkout");
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
                          appliedCoupon: appliedCoupon,
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

              {/* Coupon Section with Dropdown */}
              <div className="mb-4 border rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowCouponDropdown(!showCouponDropdown)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <RiCouponLine className="text-purple-600 mr-2" />
                    <span className="font-medium">
                      {appliedCoupon ? "Applied Coupon" : "Apply Coupon"}
                    </span>
                  </div>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${showCouponDropdown ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showCouponDropdown && (
                  <div className="p-3 border-t max-h-60 overflow-y-auto">
                    {availableCoupons.length > 0 ? (
                      availableCoupons.map((coupon) => (
                        <div
                          key={coupon._id}
                          className={`p-2 mb-2 border rounded-lg cursor-pointer hover:bg-purple-50 transition-colors ${
                            appliedCoupon?._id === coupon._id
                              ? "border-purple-500 bg-purple-50"
                              : ""
                          }`}
                          onClick={() => handleApplyCoupon(coupon)}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-mono font-bold text-sm">
                              {coupon.code}
                            </span>
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                              {coupon.discountType === "percentage"
                                ? `${coupon.discountValue}% OFF (Max ${currency}${coupon.maxDiscount})`
                                : `${currency}${coupon.discountValue} OFF`}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Min. order: {currency}
                            {coupon.minOrderAmount}
                          </p>
                          {coupon.maxDiscountAmount && (
                            <p className="text-xs text-gray-500">
                              Max discount: {currency}
                              {coupon.maxDiscountAmount}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-2">
                        No coupons available for your cart
                      </p>
                    )}
                  </div>
                )}

                {appliedCoupon && (
                  <div className="p-3 bg-purple-50 border-t flex justify-between items-center">
                    <div>
                      <span className="text-sm font-medium text-purple-700">
                        {appliedCoupon.code}
                      </span>
                      <p className="text-xs text-purple-600">
                        -{currency}
                        {discount.toFixed(2)} discount
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Manual Coupon Entry */}
              {!appliedCoupon && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Or enter coupon code manually
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                      placeholder="Enter coupon code"
                    />
                    <button
                      onClick={() => {
                        const coupon = userCoupons.find(
                          (c) => c.code === couponCode,
                        );
                        if (coupon) {
                          handleApplyCoupon(coupon);
                        } else {
                          setCouponError("Invalid coupon code");
                        }
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium shadow"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-red-600 text-xs mt-1">{couponError}</p>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>SubTotal</span>
                  <span>
                    {currency}
                    {(total - shippingCost).toFixed(2)}
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

              {discount > 0 && (
                <>
                  <hr className="my-4 border-gray-200" />
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Discount</span>
                    <span className="text-green-700">
                      - {currency}
                      {discount.toFixed(2)}
                    </span>
                  </div>
                </>
              )}

              <hr className="my-4 border-gray-200" />
              <div className="flex justify-between text-lg font-bold text-gray-800">
                <span>Total Payable</span>
                <span className="text-green-600">
                  {currency}
                  {finalTotal.toFixed(2)}
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
