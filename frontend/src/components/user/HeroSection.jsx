import React from "react";

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {fetchHomeBanner } from "../../features/admin/banner/bannerSlice";

const HeroSection = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/collection");
  };
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchHomeBanner())
  }, [])

  const { homeBanner } = useSelector(state => state.banner)

  return (
    <section className="relative w-full bg-gray-50 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={homeBanner.bannerImage}
          alt="Luxury watches collection"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 sm:py-32 lg:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="text-center lg:text-left">
            <h1 className="prata-regular text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              DISCOVER
            </h1>
            <h2 className="text-3xl md:text-4xl mb-8 text-gray-800">
              OUR COLLECTIONS
            </h2>

            <div className="border-t border-gray-300 my-8 w-3/4 lg:w-1/2 mx-auto lg:mx-0"></div>

            <div className="mb-8">
              <h3 className="text-xl md:text-2xl font-semibold mb-4 text-gray-700">
                {homeBanner.title}
              </h3>
              <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto lg:mx-0 text-gray-600">
                {homeBanner.description}
              </p>
              <button
                className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors duration-300 text-lg font-medium"
                onClick={handleClick}
              >
                {homeBanner.buttonText}
              </button>
            </div>

            <div className="border-t border-gray-300 my-8 w-3/4 lg:w-1/2 mx-auto lg:mx-0"></div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-lg">
              <span className="hover:text-gray-600 cursor-pointer">
                Velociia
              </span>
              <span className="hover:text-gray-600 cursor-pointer">
                ChronoCraft
              </span>
              <span className="hover:text-gray-600 cursor-pointer">
                Precision
              </span>
            </div>
          </div>

          {/* Image showcase */}
          <div className="relative w-full lg:w-[500px] h-[400px]">
            <div className="bg-white p-6 rounded-lg shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <img
                src={homeBanner.bagroundImage} // Replace with your product image
                alt="Precision Collection Watch"
                className="w-full h-auto object-contain"
                width="120px"
              />
              <div className="absolute -bottom-5 -right-5 bg-yellow-100 px-4 py-2 rounded-lg shadow-md">
                <span className="font-bold text-gray-800">NEW</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
