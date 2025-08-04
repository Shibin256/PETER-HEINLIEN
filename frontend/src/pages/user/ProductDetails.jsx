import React, { useEffect, useState } from "react";
import {
  FaStar,
  FaRegStar,
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getProducById,
  relatedProducts,
} from "../../features/products/productSlice";
import { useNavigate, useParams } from "react-router-dom";
import ImageZoom from "../../components/common/ImageZoom";
import {
  addToWishlist,
  getWishedProduct,
  removeFromWishlist,
} from "../../features/wishlist/wishlistSlice";
import { toast } from "react-toastify";
import { addToCart } from "../../features/cart/cartSlice";
import Title from "../../components/common/Title";
import ProductCard from "../../components/common/ProductCard";

const ProductDetails = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const dispatch = useDispatch();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const { singleProduct, productsRelated } = useSelector(
    (state) => state.products,
  );
  console.log(productsRelated, "realated products");
  // First: fetch the product
  useEffect(() => {
    if (id) {
      dispatch(getProducById(id));
      dispatch(relatedProducts(id));
    }
  }, [id, dispatch]);

  // Then: check if it's wishlisted (once product and user are available)
  useEffect(() => {
    if (user && singleProduct?._id) {
      dispatch(
        getWishedProduct({ userId: user._id, productId: singleProduct._id }),
      ).then((res) => {
        if (res.payload?.wished) {
          setIsWishlisted(true);
        } else {
          setIsWishlisted(false);
        }
      });
    }
  }, [user, singleProduct, dispatch]);

  const product = singleProduct;
  let shippingCost =0;
  const totalQuantity = product.totalQuantity;
  if (product && product.price < 500) {
    shippingCost = 50;
  }

  if (!product || !product.images || product.images.length === 0) {
    return <div className="text-center p-10">Loading product details...</div>;
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length,
    );
  };

  const handlewishClick = async (e) => {
    e.preventDefault(); // Prevent link navigation when clicking the heart icon
    if (!user) {
      toast.warning("Please login to use wishlist");
      return;
    }

    try {
      if (!isWishlisted) {
        dispatch(addToWishlist({ userId: user._id, productId: product._id }));
        toast.success("Added to wishlist");
      } else {
        // Remove from wishlist
        dispatch(
          removeFromWishlist({ userId: user._id, productId: product._id }),
        );
        toast.info("Removed from wishlist");
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error("Wishlist error:", error);
      toast.error("Something went wrong");
    }
  };

  const handleAddCart = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.warning("Please login to use Cart");
      return;
    }
    try {
      const res = await dispatch(
        addToCart({ userId: user._id, productId: singleProduct._id }),
      );
      console.log(res.payload);
      if (res.payload === "max quantity added") {
        toast.warning("max quantity added");
      } else if (res.payload === "Product is out of stock") {
        toast.warning("Product is out of stock");
      } else {
        toast.success("Added to cart");
        navigate("/cart");
      }
    } catch (err) {
      console.error("cart error:", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="px-6 md:px-16 lg:px-24 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex flex-col-reverse md:flex-row gap-6 w-full lg:w-1/2">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-20 h-20 flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all ${currentImageIndex === index ? "border-blue-500" : "border-gray-200"}`}
              >
                <img
                  src={img}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="relative flex-1">
            <div className="aspect-squar w-full bg-gray-100 rounded-xl">
              <ImageZoom imageUrl={product.images[currentImageIndex]} />
            </div>
            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
            >
              <FaChevronLeft className="text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
            >
              <FaChevronRight className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Right - Product Info */}
        <div className="w-full lg:w-1/2">
          <div className="mb-6">
            <span className="text-sm font-medium text-blue-600">
              {product.category?.categoryName}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mt-1 mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex text-yellow-500">
                {Array(5)
                  .fill()
                  .map((_, i) =>
                    i < product.rating ? (
                      <FaStar key={i} />
                    ) : (
                      <FaRegStar key={i} />
                    ),
                  )}
              </div>
              <span className="text-sm text-gray-500">(2 reviews)</span>
            </div>
            <div className="mb-4">
              {product.offerPrice ? (
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-semibold text-red-600">
                      ₹{product.offerPrice}
                    </p>
                    <p className="text-lg text-gray-500 line-through">
                      ₹{product.price}
                    </p>
                    <span className="text-sm text-green-600 font-medium">
                      (
                      {Math.round(
                        ((product.price - product.offerPrice) / product.price) *
                          100,
                      )}
                      % OFF)
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-2xl font-semibold text-gray-800">
                  ₹{product.price}
                </p>
              )}
            </div>

            <p className="text-gray-700 mb-6">{product.description}</p>
          </div>

          {/* Features */}
          {/* <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Features</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-700">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div> */}

          {/* Quantity Selector */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Quantity</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 border border-gray-300 rounded-lg px-4 py-2 w-fit">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="text-xl text-gray-600 hover:text-gray-900"
                  disabled={quantity <= 1}
                >
                  -
                </button>

                <span className="w-8 text-center">{quantity}</span>

                <button
                  onClick={() =>
                    setQuantity((prev) =>
                      Math.min(Math.min(4, totalQuantity), prev + 1),
                    )
                  }
                  className="text-xl text-gray-600 hover:text-gray-900"
                  disabled={quantity >= Math.min(4, totalQuantity)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={handleAddCart}
              className="flex-1 bg-teal-700 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
            >
              ADD TO CART
            </button>
            {/* <button  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md">
              BUY NOW
            </button> */}
          </div>

          {/* Wishlist */}
          <button
            onClick={handlewishClick}
            className={`flex items-center gap-2 mb-8 ${isWishlisted ? "text-red-500" : "text-gray-600"} transition-colors`}
          >
            <FaHeart className={isWishlisted ? "fill-current" : ""} />
            <span>
              {isWishlisted ? "REMOVE FROM WISHLIST" : "ADD TO WISHLIST"}
            </span>
          </button>

          {/* Product Meta */}
          <div className="text-sm text-gray-700 border-t pt-6">
            <p className="mb-2">
              <span className="font-medium">Category:</span>{" "}
              {product.category?.categoryName}
            </p>
            <p>
              <span className="font-medium">Tags:</span>{" "}
              <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">
                {product.tags}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Ratings & Reviews Section */}
      {/* <div className="mt-16 border-t pt-10">
        <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          Review 1
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-semibold mb-1">Alex Johnson</p>
                <div className="flex text-yellow-500 mb-2">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaRegStar />
                </div>
              </div>
              <span className="text-sm text-gray-500">2 weeks ago</span>
            </div>
            <p className="text-gray-700">
              "Absolutely love this watch! The build quality is exceptional and it looks even better in person. 
              The leather strap is comfortable and the face is very readable in all lighting conditions."
            </p>
          </div>

          Review 2
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-semibold mb-1">Sarah Miller</p>
                <div className="flex text-yellow-500 mb-2">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
              </div>
              <span className="text-sm text-gray-500">1 month ago</span>
            </div>
            <p className="text-gray-700">
              "This is my second purchase from this brand and I'm equally impressed. The watch keeps perfect time 
              and has become my daily wear. Highly recommend for anyone looking for a luxury timepiece."
            </p>
          </div>
        </div>
      </div> */}
      <div className="mt-16">
        {/* Top Separator Line */}
        <div className="border-t border-gray-200 mb-8"></div>

        {/* Title - Left Aligned */}
        <div className="mb-10">
          <Title
            text1={"Related"}
            text2={"Products"}
            className="text-2xl font-bold text-gray-800"
          />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productsRelated.map((product) => (
            <div key={product._id} className="w-full max-w-[280px] mx-auto">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
