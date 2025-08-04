import React, { useEffect } from "react";
import Title from "../common/Title";
import heroImg2 from "../../assets/heroSectionWatch2.png";
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

  //pass category id when click button
  const handleclick = (categoryId, categoryName) => {
    // console.log(categoryId,'888888888888888')
    navigate("/category-collection", { state: { categoryId, categoryName } });
  };

  return (
    <div className="our-model my-10 px-2 sm:px-4">
      {/* Heading Section */}
      <div className="text-center py-4 max-w-2xl mx-auto">
        <Title text1="OUR" text2="MODEL" />
        <p className="mt-2 text-xs sm:text-sm text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-8">
        {categories.map((category, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            {/* Category Image */}
            <div className="relative h-64 w-full overflow-hidden">
              <img
                src={heroImg2}
                alt={category.categoryName}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
                <button
                  onClick={() =>
                    handleclick(category._id, category.categoryName)
                  }
                  className="text-white text-sm font-semibold px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: "#003543" }}
                >
                  Shop Now
                </button>
              </div>
            </div>

            {/* Category Info */}
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-800">
                {category.categoryName}
              </h3>
              {/* <p className="mt-1 text-sm text-gray-500">
                {category.description}
              </p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryProducts;
