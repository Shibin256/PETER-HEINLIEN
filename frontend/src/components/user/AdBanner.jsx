import React, { useEffect } from "react";
import adBackgroundImg from "../../assets/adBannerImg.jpg";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdsCoupons } from "../../features/coupons/couponsSlice";
import { toast } from "react-toastify";

const AdBanner = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAdsCoupons());
  }, [dispatch]); 

  const { adsCoupon } = useSelector((state) => state.coupons);

  const adContent = {
    title: "Exclusive Watch Deal!",
    description: adsCoupon
      ? adsCoupon.discountType === "percentage"
        ? `Get up to ${adsCoupon.discountValue}% off on our premium collection of watches for Men, Women, and Couples. Shop now and elevate your style!`
        : `Get ₹${adsCoupon.discountValue} off on our premium collection of watches for Men, Women, and Couples. Shop now and elevate your style!`
      : "Fetching latest deals...",
    buttonText: adsCoupon ? `Copy code: ${adsCoupon.code}` : "Loading...",
    backgroundImage: adBackgroundImg,
  };

  const handleCopy = () => {
    if (adsCoupon?.code) {
      navigator.clipboard.writeText(adsCoupon.code);
      toast.success("Coupon code copied to clipboard!");
    } else {
      toast.error("No coupon code available");
    }
  };

  return (
    <div className="ad-banner my-10 px-2 sm:px-4">
      <div
        className="relative bg-cover bg-center h-64 sm:h-72 rounded-lg overflow-hidden shadow-lg group"
        style={{ backgroundImage: `url(${adContent.backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent group-hover:from-black/80 transition-all duration-300" />
        <div className="relative z-10 flex flex-col items-start justify-center h-full p-6 sm:p-8 max-w-lg">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
            {adContent.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-200 mb-4">
            {adContent.description}
          </p>
          <button
            onClick={handleCopy}
            className="inline-block px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md shadow-md transition-colors duration-300"
            style={{ backgroundColor: "#003543" }}
          >
            {adContent.buttonText}
          </button>
        </div>
        <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-blue-500/20 rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
};

export default AdBanner;
