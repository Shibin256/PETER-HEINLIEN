import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
    createPaymentOrder,
    placeOrder,
    verifyPayment,
} from "../../features/orders/ordersSlice";
import { toast } from "react-toastify";
import { resetCart, toggleIsLocked } from "../../features/cart/cartSlice";
import { getWallet } from "../../features/wallet/walletSlice";
const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

const PaymentPage = () => {
    const [selectedPayment, setSelectedPayment] = useState("");
    const [showCODMessage, setShowCODMessage] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [orderStatus, setOrderStatus] = useState(null); // 'success' or 'error'
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [date, setDate] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    let {
        address,
        cartItems,
        totalPrice,
        discount,
        shippingCost,
        userId,
        deliveryDate,
    } = location.state || {};
    if (discount > 0) {
        totalPrice -= discount;
    }
    if (shippingCost) {
        totalPrice -= shippingCost
    }

    const { currency } = useSelector((state) => state.global);
    const { isLocked } = useSelector((state) => state.cart);
    console.log(isLocked);

    const handlePaymentChange = (method) => {
        setSelectedPayment(method);
        if (method === "cod") {
            setShowCODMessage(true);
        } else {
            setShowCODMessage(false);
        }
    };

    useEffect(() => {
        dispatch(getWallet(userId));
        dispatch(toggleIsLocked({ userID: userId, lock: false }));

    }, []);

    const { walletAmount } = useSelector((state) => state.wallet);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        // If user landed here directly without state, redirect them to cart
        if (!location.state || !address || !cartItems) {
            navigate("/cart", { replace: true });
        }
    }, []);

    const handlePayment = async (amount) => {
        try {
            const result = await dispatch(createPaymentOrder(amount)).unwrap();
            const { order } = result;

            return new Promise((resolve, reject) => {
                const options = {
                    key: razorpayKey,
                    amount: order.amount,
                    currency: order.currency,
                    name: "Peter Heinlien Watches",
                    description: "Watch Order",
                    order_id: order.id,
                    handler: async (response) => {
                        try {
                            const verifyRes = await dispatch(
                                verifyPayment(response),
                            ).unwrap();
                            if (verifyRes.success) {
                                resolve(true); // Payment success
                            } else {
                                reject("Payment verification failed");
                            }
                        } catch (err) {
                            console.log(err)
                            reject("Payment verification error");
                        }
                    },
                    prefill: {
                        name: "Customer Name",
                        email: "customer@example.com",
                        contact: "9999999999",
                    },
                    theme: {
                        color: "#3399cc",
                    },
                    modal: {
                        ondismiss: () => {
                            reject("Payment was cancelled by user");
                        },
                    },
                    retry: {
                        enabled: false, // disables auto retry popup
                    },
                };

                const rzp = new window.Razorpay(options);

                rzp.on("payment.failed", function (response) {
                    const errorMessage =
                        response.error?.description || "Payment failed due to an error.";
                    reject(errorMessage);
                });

                rzp.open();
            });
        } catch (err) {
            console.error("Razorpay init failed:", err);
            return false;
        }
    };

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        try {
            if (selectedPayment == "cod") {
                const res = await dispatch(
                    placeOrder({
                        orderdata: {
                            address,
                            cartItems,
                            totalPrice,
                            shippingCost,
                            userId,
                            deliveryDate,
                        },
                        paymentMethod: selectedPayment,
                    }),
                ).unwrap();
                setOrderId(res.order.orderId);
                console.log(res, "order placed successfully");
                const date = new Date(res.order.DeliveryDate);

                // First replace with home
                navigate("/", { replace: true });

                // Now push order success page as a fresh new entry
                setTimeout(() => {
                    navigate("/order-success", { state: { order: res.order } });
                }, 0);
            } else if (selectedPayment === "razorpay") {
                if (isLocked === true) {
                    toast.error("the cart already locked and need to payment complete");
                    navigate("/");
                } else {
                    await dispatch(toggleIsLocked({ userID: userId, lock: true }));

                    let totalAmount = totalPrice + (shippingCost || 0);
                    const paymentSuccess = await handlePayment({
                        totalPrice: totalAmount,
                    });
                    console.log(paymentSuccess);
                    if (paymentSuccess) {
                        const res = await dispatch(
                            placeOrder({
                                orderdata: {
                                    address,
                                    cartItems,
                                    totalPrice,
                                    shippingCost,
                                    userId,
                                    deliveryDate,
                                },
                                paymentMethod: selectedPayment,
                            }),
                        ).unwrap();
                        setOrderId(res.order.orderId);
                        const date = new Date(res.order.DeliveryDate);

                        navigate("/order-success", {
                            state: { order: res.order },
                            replace: true,
                        });
                        dispatch(resetCart());
                        // First replace with home
                        navigate("/", { replace: true });

                        // Now push order success page as a fresh new entry
                        setTimeout(() => {
                            navigate("/order-success", { state: { order: res.order } });
                        }, 0);
                    }
                    // await dispatch(toggleIsLocked({ userID: userId, lock: false }))
                }
            } else if (selectedPayment === "walletPay") {
                let totalAmount = totalPrice + (shippingCost || 0);
                if (totalAmount > walletAmount) {
                    setShowModal(true);
                } else {
                    const res = await dispatch(
                        placeOrder({
                            orderdata: {
                                address,
                                cartItems,
                                totalPrice,
                                shippingCost,
                                userId,
                                deliveryDate,
                            },
                            paymentMethod: selectedPayment,
                        }),
                    ).unwrap();
                    setOrderId(res.order.orderId);
                    console.log(res, "order placed successfully");
                    const date = new Date(res.order.DeliveryDate);
                    const formattedDeliveryDate = date.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                    });
                    navigate("/", { replace: true });

                    setTimeout(() => {
                        navigate("/order-success", { state: { order: res.order } });
                    }, 0);
                }
            } else {
                navigate("/cart");
            }
        } catch (error) {
            setOrderStatus("error");
            console.log(error);
            navigate("/order-failed", {
                state: {
                    cartItems,
                    totalPrice,
                    shippingCost,
                    userId,
                },
            });
        } finally {
            await dispatch(toggleIsLocked({ userID: userId, lock: false }));
            setIsProcessing(false);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        if (orderStatus === "success") {
            navigate("/my-orders");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-sm">
            <h2 className="text-3xl font-bold text-green-700 mb-6 border-b-2 border-green-200 pb-3">
                PAYMENT
            </h2>

            {/* Payment Methods */}
            <div className="mb-6 bg-white rounded-lg shadow overflow-hidden">
                <div className="space-y-1">
                    {/* UPI Option */}
                    <div
                        className={`p-4 transition-all ${selectedPayment === "upi" ? "bg-green-50 border-l-4 border-green-500" : "hover:bg-gray-50"}`}
                    >
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="payment"
                                className="h-5 w-5 text-green-600 focus:ring-green-500"
                                checked={selectedPayment === "razorpay"}
                                onChange={() => handlePaymentChange("razorpay")}
                            />
                            <div className="ml-3">
                                <span className="block font-medium text-gray-800">
                                    Razorpay
                                </span>
                                <span className="block text-sm text-gray-500">
                                    Pay instantly using any razorpay app
                                </span>
                            </div>
                            <div className="ml-auto flex space-x-2">
                                {/* UPI app icons would go here */}
                            </div>
                        </label>
                    </div>

                    {/* Net Banking Option */}
                    <div
                        className={`p-4 transition-all ${selectedPayment === "walletPay" ? "bg-green-50 border-l-4 border-green-500" : "hover:bg-gray-50"}`}
                    >
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="payment"
                                className="h-5 w-5 text-green-600 focus:ring-green-500"
                                checked={selectedPayment === "walletPay"}
                                onChange={() => handlePaymentChange("walletPay")}
                            />
                            <div className="ml-3">
                                <span className="block font-medium text-gray-800">Wallet</span>
                                <span className="block text-sm text-gray-500">
                                    Your balance (Rs.{walletAmount})
                                </span>
                            </div>
                        </label>
                    </div>

                    {/* Cash on Delivery Option */}
                    <div
                        className={`p-4 transition-all ${selectedPayment === "cod" ? "bg-green-50 border-l-4 border-green-500" : "hover:bg-gray-50"}`}
                    >
                        <label className="flex items-center cursor-pointer">
                            <input
                                disabled={totalPrice > 1000 ? true : false}
                                type="radio"
                                name="payment"
                                className="h-5 w-5 text-green-600 focus:ring-green-500"
                                checked={selectedPayment === "cod"}
                                onChange={() => handlePaymentChange("cod")}
                            />
                            <div className="ml-3">
                                <span className="block font-medium text-gray-800">
                                    Cash on Delivery
                                </span>
                                {totalPrice < 1000 ? (
                                    <span className="block text-sm text-gray-500">
                                        Pay when you receive your order
                                    </span>
                                ) : (
                                    <span className="block text-sm text-red-500">
                                        No delivery for orders over ₹1000
                                    </span>
                                )}
                            </div>
                        </label>
                    </div>
                </div>
            </div>

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
                        <span>{`${currency}${totalPrice + shippingCost} `}</span>
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
                    className={`px-6 py-2 rounded-md text-white transition-colors ${selectedPayment ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
                    disabled={!selectedPayment || isProcessing}
                >
                    {isProcessing
                        ? "PROCESSING..."
                        : selectedPayment === "cod"
                            ? "CONFIRM ORDER"
                            : "PROCEED TO PAYMENT"}
                </button>
            </div>

            {/* Order Status Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="text-center">
                            {orderStatus === "success" ? (
                                <>
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                        <svg
                                            className="h-6 w-6 text-green-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="mt-3 text-lg font-medium text-gray-900">
                                        Order Placed Successfully!
                                    </h3>
                                    <div className="mt-2 text-sm text-gray-500">
                                        <p>
                                            Your order has been placed and will be delivered by {date}
                                            .
                                        </p>
                                        <p className="mt-2">Order ID: # {orderId}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                        <svg
                                            className="h-6 w-6 text-red-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="mt-3 text-lg font-medium text-gray-900">
                                        Order Failed
                                    </h3>
                                    <div className="mt-2 text-sm text-gray-500">
                                        <p>Your wallet balance is insufficient</p>
                                        <p>Please try again or use a different payment method.</p>
                                    </div>
                                </>
                            )}
                            <div className="mt-5">
                                <button
                                    type="button"
                                    className={`inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white ${orderStatus === "success" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} focus:outline-none sm:text-sm`}
                                    onClick={handleModalClose}
                                >
                                    {orderStatus === "success" ? "View Orders" : "Try Again"}
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
