import React, { useEffect } from "react";
import Title from "../common/Title";
import womensCollection from "../../assets/womensCollection.jpg";
import mensCollection from "../../assets/mensCollection.jpg";
import couplesCollection from "../../assets/couplesCollection.jpg";
import { useDispatch, useSelector } from "react-redux";
import { getBrandAndCollection } from "../../features/products/productSlice";
import { useNavigate } from "react-router-dom";

const CategoryProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getBrandAndCollection());
  }, []);

  const { categories } = useSelector((state) => state.products);

  const getCategoryImage = (categoryName) => {
    const lowerCaseName = categoryName.toLowerCase();
    if (lowerCaseName.includes("women") || lowerCaseName.includes("ladies")) {
      return womensCollection;
    } else if (lowerCaseName.includes("men") || lowerCaseName.includes("gentlemen")) {
      return mensCollection;
    } else if (lowerCaseName.includes("couple") || lowerCaseName.includes("pair")) {
      return couplesCollection;
    }
    return womensCollection;
  };

  const handleClick = (categoryId, categoryName) => {
    navigate("/category-collection", { state: { categoryId, categoryName } });
  };

  return (
    <div className="our-model py-12 px-4 sm:px-6 bg-gray-50">
      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <Title text1="OUR" text2="COLLECTIONS" />
        <p className="mt-4 text-sm sm:text-base text-gray-600 font-light">
          Discover our exquisite timepieces crafted for every style and occasion
        </p>
        <div className="mt-6 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-3/4 mx-auto"></div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {categories.map((category, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
          >
            {/* Clickable area for the entire card */}
            <div 
              className="absolute inset-0 z-20 cursor-pointer"
              onClick={() => handleClick(category._id, category.categoryName)}
            ></div>
            
            {/* Category Image */}
            <div className="relative h-80 w-full overflow-hidden">
              <img
                src={getCategoryImage(category.categoryName)}
                alt={category.categoryName}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Shop Now Button - Now positioned higher */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick(category._id, category.categoryName);
                  }}
                  className="px-8 py-3 bg-white text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-colors duration-300 shadow-lg flex items-center"
                >
                  Shop Now
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Category Info - Now with pointer-events-none */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-center z-10 pointer-events-none">
              <h3 className="text-2xl font-semibold text-white mb-1">
                {category.categoryName}
              </h3>
            </div>
            
            {/* Floating Tag */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm z-30">
              <span className="text-xs font-medium text-gray-900 uppercase tracking-wider">
                New Arrivals
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryProducts;