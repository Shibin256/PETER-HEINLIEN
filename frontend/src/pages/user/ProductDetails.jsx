import React, { useEffect, useState } from 'react';
import {
  FaStar,
  FaRegStar,
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProducById,
  relatedProducts,
} from '../../features/products/productSlice';
import { useNavigate, useParams } from 'react-router-dom';
import ImageZoom from '../../components/common/ImageZoom';
import {
  addToWishlist,
  getWishedProduct,
  removeFromWishlist,
} from '../../features/wishlist/wishlistSlice';
import { toast } from 'react-toastify';
import { addToCart } from '../../features/cart/cartSlice';
import Title from '../../components/common/Title';
import ProductCard from '../../components/common/ProductCard';
import ProductDetailsSkeleton from '../../components/common/sketion/ProductDetailsSkeleton';

const ProductDetails = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [localCart, setLocalCart] = useState([]);
  const dispatch = useDispatch();

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const { singleProduct, productsRelated } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (id) {
      dispatch(getProducById(id)).then((res) => {
        if (res.type == 'product/getProductById/rejected') {
          return navigate('NotFound');
        }
      });
      if (user) {
        dispatch(relatedProducts({ id: id, userId: user._id }));
      } else {
        dispatch(relatedProducts({ id: id }));
      }
    }
  }, [id, dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (user && singleProduct?._id) {
      dispatch(
        getWishedProduct({ userId: user._id, productId: singleProduct._id })
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
  let shippingCost = 0;
  const totalQuantity = product?.totalQuantity || 0;
  if (product && product.price < 500) {
    shippingCost = 50;
  }

  // Check if product is out of stock
  const isOutOfStock = totalQuantity === 0;
  // Check if max quantity reached (limited to 4 or available stock)
  const maxSelectableQuantity = Math.min(4, totalQuantity);
  const isMaxQuantityReached = quantity >= maxSelectableQuantity;

  if (!product || product._id !== id) {
    return <ProductDetailsSkeleton />;
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  };

  const handlewishClick = async (e) => {
    e.preventDefault(); // Prevent link navigation when clicking the heart icon
    if (!user) {
      toast.warning('Please login to use wishlist');
      return;
    }

    try {
      if (!isWishlisted) {
        dispatch(addToWishlist({ userId: user._id, productId: product._id }));
        toast.success('Added to wishlist');
      } else {
        // Remove from wishlist
        dispatch(
          removeFromWishlist({ userId: user._id, productId: product._id })
        );
        toast.info('Removed from wishlist');
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error('Wishlist error:', error);
      toast.error('Something went wrong');
    }
  };

  const handleAddCart = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.warning('Please login to use Cart');
      return;
    }

    if (isOutOfStock) {
      toast.warning('Product is out of stock');
      return;
    }

    try {
      const res = await dispatch(
        addToCart({
          userId: user._id,
          productId: singleProduct._id,
          quantity: quantity,
        })
      );

      if (res.payload === 'max quantity added') {
        toast.warning('Maximum quantity reached');
      } else if (res.payload === 'Product is out of stock') {
        toast.warning('Product is out of stock');
      } else {
        toast.success(`${quantity} item(s) added to cart`);
        // Optionally reset quantity to 1 after adding to cart
        // setQuantity(1);
      }
    } catch (err) {
      console.error('cart error:', err);
      toast.error('Something went wrong');
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.warning('Please login to buy');
      return;
    }

    if (isOutOfStock) {
      toast.warning('Product is out of stock');
      return;
    }

    const forwardprice = singleProduct.offerPrice || singleProduct.price;

    // Clear previous local cart and add current item
    const newCartItem = {
      price: forwardprice,
      productId: singleProduct,
      productSubTotal: forwardprice * quantity,
      quantity: quantity,
    };

    const updatedCart = [newCartItem];
    setLocalCart(updatedCart);

    const shipping = newCartItem.productSubTotal > 1000 ? 0 : 50;
    navigate('/checkout', {
      state: {
        cartItems: updatedCart,
        totalPrice: newCartItem.productSubTotal + shipping,
        shippingCost: shipping,
        userId: user._id,
        from: true,
      },
    });
  };

  const handleQuantityChange = (increment) => {
    if (increment) {
      // Increment quantity
      if (quantity < maxSelectableQuantity) {
        setQuantity((prev) => prev + 1);
      }
    } else {
      // Decrement quantity
      if (quantity > 1) {
        setQuantity((prev) => prev - 1);
      }
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
                className={`w-20 h-20 flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all ${
                  currentImageIndex === index
                    ? 'border-blue-500'
                    : 'border-gray-200'
                }`}
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
                    i < product.averageRating ? (
                      <FaStar key={i} />
                    ) : (
                      <FaRegStar key={i} />
                    )
                  )}
              </div>
              <span className="text-sm text-gray-500">
                {product.numReviews}
              </span>
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
                          100
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

          {/* Stock Status */}
          <div className="mb-4">
            {isOutOfStock ? (
              <span className="inline-block bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                Out of Stock
              </span>
            ) : totalQuantity <= 5 ? (
              <span className="inline-block bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
                Only {totalQuantity} left in stock
              </span>
            ) : (
              <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                In Stock
              </span>
            )}
          </div>

          {/* Quantity Selector - Only show if in stock */}
          {!isOutOfStock && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4 border border-gray-300 rounded-lg px-4 py-2 w-fit">
                  <button
                    onClick={() => handleQuantityChange(false)}
                    className={`text-xl text-gray-600 hover:text-gray-900 ${
                      quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>

                  <span className="w-8 text-center">{quantity}</span>

                  {/* Only show + button if not at max quantity */}
                  {!isMaxQuantityReached && (
                    <button
                      onClick={() => handleQuantityChange(true)}
                      className="text-xl text-gray-600 hover:text-gray-900"
                    >
                      +
                    </button>
                  )}
                </div>
                {isMaxQuantityReached && (
                  <span className="text-sm text-orange-600">
                    Max quantity reached
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={handleAddCart}
              disabled={isOutOfStock}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors shadow-md ${
                isOutOfStock
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-teal-700 hover:bg-teal-700 text-white'
              }`}
            >
              {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors shadow-md ${
                isOutOfStock
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 hover:bg-gray-800 text-white'
              }`}
            >
              {isOutOfStock ? 'OUT OF STOCK' : 'BUY NOW'}
            </button>
          </div>

          {/* Wishlist */}
          <button
            onClick={handlewishClick}
            className={`flex items-center gap-2 mb-8 ${
              isWishlisted ? 'text-red-500' : 'text-gray-600'
            } transition-colors`}
          >
            <FaHeart className={isWishlisted ? 'fill-current' : ''} />
            <span>
              {isWishlisted ? 'REMOVE FROM WISHLIST' : 'ADD TO WISHLIST'}
            </span>
          </button>

          {/* Product Meta */}
          <div className="text-sm text-gray-700 border-t pt-6">
            <p className="mb-2">
              <span className="font-medium">Category:</span>{' '}
              {product.category?.categoryName}
            </p>
            <p>
              <span className="font-medium">Tags:</span>{' '}
              <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">
                {product.tags}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Ratings & Reviews Section */}
      <div className="mt-16 border-t pt-10">
        <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>

        {product.reviews && product.reviews.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {product.reviews.map((review) => (
              <div key={review._id} className="bg-gray-50 p-6 rounded-xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-semibold mb-1">
                      {review.user?.name || 'Anonymous'}
                    </p>
                    <div className="flex text-yellow-500 mb-2">
                      {[...Array(5)].map((_, i) =>
                        i < review.rating ? (
                          <FaStar key={i} />
                        ) : (
                          <FaRegStar key={i} />
                        )
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <p className="text-gray-700">"{review.comment}"</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No reviews yet for this product</p>
          </div>
        )}

        {/* Summary stats */}
        <div className="mt-8 flex items-center gap-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) =>
              i < Math.floor(product.averageRating) ? (
                <FaStar key={i} className="text-yellow-500" />
              ) : (
                <FaRegStar key={i} className="text-yellow-500" />
              )
            )}
          </div>
          <p className="text-gray-700">
            {product.averageRating.toFixed(1)} out of 5
          </p>
          <span className="text-gray-500">•</span>
          <p className="text-gray-700">
            {product.numReviews} review{product.numReviews !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="mt-16">
        {/* Top Separator Line */}
        <div className="border-t border-gray-200 mb-8"></div>

        {/* Title - Left Aligned */}
        <div className="mb-10">
          <Title
            text1={'Related'}
            text2={'Products'}
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
