import { useEffect } from "react";
import Title from "../common/Title";
import ProductCard from "../common/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { topRatedCollections, topRatedCollectionsWithOutUser } from "../../features/products/productSlice";

const TopRated = () => {
  const dispatch = useDispatch();
  // const { user } = useSelector((state) => state.auth);
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const { topRated } = useSelector((state) => state.products);
  const products = topRated
  useEffect(() => {
    if (user) {
      dispatch(topRatedCollections({ userId: user._id }))
    } else {
      dispatch(topRatedCollectionsWithOutUser())
    }
  }, []);

  return (
    <div className="latest-collection my-10 px-2 sm:px-4">
      {/* Heading Section */}
      <div className="text-center py-4 max-w-2xl mx-auto">
        <Title text1="TOP" text2="RATED" />
        <p className="mt-2 text-xs sm:text-sm text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
      </div>

      {/* Products Grid */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopRated;
