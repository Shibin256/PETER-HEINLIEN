import axios from 'axios';
import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addToWishlist, getWishedProduct, getWishlist, removeFromWishlist } from '../../features/wishlist/wishlistSlice';
import { addToCart } from '../../features/cart/cartSlice';
import { useEffect } from 'react';

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const dispatch = useDispatch()

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (user && product?._id) {
      dispatch(getWishedProduct({ userId: user._id, productId: product._id }))
        .then((res) => {
          if (res.payload?.wished) {
            setIsFavorite(true);
          } else {
            setIsFavorite(false);
          }
        });
    }
  }, [])


  const toggleFavorite = async (e) => {
    e.preventDefault(); // Prevent link navigation when clicking the heart icon
    if (!user) {
      toast.warning('Please login to use wishlist');
      return;
    }

    try {
      if (!isFavorite) {
        // Add to wishlist
        dispatch(addToWishlist({ userId: user._id, productId: product._id }))
        toast.success('Added to wishlist');
      } else {
        // Remove from wishlist
        dispatch(removeFromWishlist({ userId: user._id, productId: product._id }))
        toast.info('Removed from wishlist');
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Wishlist error:', err);
      toast.error('Something went wrong');
    }
  };

  const handleAddCart = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.warning('Please login to use Cart');
      return;
    }
    try {
      const res = await dispatch(addToCart({ userId: user._id, productId: product._id }))
      console.log(res.payload);
      if (res.payload == 'max quantity added') {
        toast.warning('max quantity added')
      }else if(res.payload=='Product is out of stock'){
              toast.warning('Only this much products are left')
      }else {
        toast.success('Added to cart');
      }
    } catch (err) {
      console.error('cart error:', err);
      toast.error('Something went wrong');
    }
  }

  return (
    <Link to={`/product/${product._id}`} className="block">
      <div className="relative w-64 rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-md hover:shadow-xl transition duration-300 group">
        {/* Top bar */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-10">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium shadow-sm 
            ${product.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {product.availability ? 'In Stock' : 'Out of Stock'}
          </span>

          <div className="flex gap-1 z-20">
            <button
              onClick={toggleFavorite}
              className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100 transition"
              aria-label="Toggle Favorite"
            >
              {isFavorite ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-500" />}
            </button>
            {product.availability && <button
              onClick={handleAddCart}
              className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100 transition"
              aria-label="Add to Cart"
            >
              <FaShoppingCart className="text-gray-600" />
            </button>}
          </div>
        </div>

        {/* Image */}
        <div className="h-48 w-full overflow-hidden rounded-t-2xl">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
          />
        </div>

        {/* Details */}
        <div className="p-4 flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{product.name}</h3>

          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-sm line-clamp-2 w-[70%]">{product.description}</p>

            {/* Price */}
            <div className="text-right">
              <span className="text-base font-semibold text-gray-800">{product.price} Rs</span>
              {product.discountedPrice && (
                <div className="text-xs text-gray-400 line-through">{product.originalPrice} Rs</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
