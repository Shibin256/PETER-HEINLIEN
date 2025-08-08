import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaCopy } from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import { RiCouponLine } from "react-icons/ri";
import AuthInput from "../../components/common/AuthInput";
import { fetchUserCoupons } from "../../features/coupons/couponsSlice";

const Coupons = () => {
    const { userCoupons, loading } = useSelector((state) => state.coupons);
    const { user } = useSelector((state) => state.auth);
    const [filteredCoupons, setFilteredCoupons] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchUserCoupons())
    }, [])
    console.log(userCoupons)
    useEffect(() => {
        if (userCoupons && user) {
            const availableCoupons = userCoupons.filter(coupon => {
                const isActive = new Date(coupon.expiresAt) > new Date();
                const notUsed = !coupon.usersUsed.includes(user._id);
                const withinLimit = coupon.usersUsed.length < coupon.usageLimit;
                return isActive && notUsed && withinLimit;
            });
            setFilteredCoupons(availableCoupons);
            console.log(filteredCoupons, 'filtered coupons');
        }

    }, [userCoupons, user]);

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        toast.success(
            <div>
                <p className="font-medium">Coupon copied!</p>
                <p className="text-sm">Paste it at checkout</p>
            </div>,
            { icon: <RiCouponLine className="text-purple-500" /> }
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) return (
        <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
    );

    return (
        <div className="px-4 py-6 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center">
                    <RiCouponLine className="mr-2 text-purple-600" />
                    Available Coupons
                </h2>
            </div>

            {filteredCoupons.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <RiCouponLine className="mx-auto text-4xl text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-600">No available coupons</h3>
                    <p className="text-gray-500 mt-1">
                        {userCoupons?.length > 0
                            ? "You've either used all coupons or none are currently active."
                            : "There are no coupons available at the moment."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredCoupons
                        .filter(coupon =>
                            coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            coupon.discountType.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((coupon) => (
                            <div
                                key={coupon._id}
                                className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded mb-2">
                                            {coupon.discountType === 'percentage'
                                                ? `${coupon.discountValue}% OFF`
                                                : `₹${coupon.discountValue} OFF`}
                                        </span>
                                        {coupon.minOrderAmount > 0 && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Min. order: ₹{coupon.minOrderAmount}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleCopyCode(coupon.code)}
                                        className="text-purple-600 hover:text-purple-800 flex items-center"
                                        aria-label="Copy coupon code"
                                    >
                                        <FaCopy className="mr-1" />
                                        <span className="text-sm">Copy</span>
                                    </button>
                                </div>

                                <div className="mt-3 flex items-center justify-between">
                                    <div className="font-mono font-bold text-lg tracking-wide">
                                        {coupon.code}
                                    </div>
                                    <div className="flex items-center text-xs text-gray-500">
                                        <FiClock className="mr-1" />
                                        <span>Expires {formatDate(coupon.expiresAt)}</span>
                                    </div>
                                </div>

                                {/* <div className="mt-3 pt-3 border-t border-dashed border-gray-200 text-xs">
                                    <div className="flex justify-between text-gray-500">
                                        <span>Uses remaining:</span>
                                        <span className="font-medium">
                                            {coupon.usageLimit - coupon.usersUsed.length}/{coupon.usageLimit}
                                        </span>
                                    </div>
                                </div> */}
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default Coupons;