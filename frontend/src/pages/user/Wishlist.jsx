import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getWishlist,
  removeFromWishlist,
} from "../../features/wishlist/wishlistSlice";
import { toast } from "react-toastify";
import Title from "../../components/common/Title";
import { wishlistToCart } from "../../features/cart/cartSlice";

const Wishlist = () => {
  const dispatch = useDispatch();

  const user = useMemo(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  }, []);

  const { wishlist } = useSelector((state) => state.wishlist);

  const [selectedAction, setSelectedAction] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(null);

  useEffect(() => {
    if (user?._id) {
      dispatch(getWishlist(user._id));
    }
  }, [dispatch, user?._id]);

  const handleActionChange = (e) => {
    setSelectedAction(e.target.value);
  };

  const handleApplyAction = () => {
    if (!selectedAction) return;

    setIsProcessing(true);
    setTimeout(() => {
      if (selectedAction === "addToCart") {
        console.log("Adding selected to cart");
      } else if (selectedAction === "removeFromWishlist") {
        // implement multi-delete logic here
      }
      setSelectedAction("");
      setIsProcessing(false);
    }, 800);
  };

  const handleRemoveItem = async (id) => {
    try {
      setIsDeletingId(id);
      await dispatch(
        removeFromWishlist({ userId: user._id, productId: id }),
      ).unwrap();
      toast.success("Removed from wishlist");
      dispatch(getWishlist(user._id));
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleAddAllToCart = async () => {
    setIsProcessing(true);
    try {
      let productIds = [];
      for (let item of wishlist) {
        productIds.push(item._id);
      }
      const res = await dispatch(
        wishlistToCart({ userId: user._id, productIds: productIds }),
      );
      console.log(res);
      if (res.type == "user/cart/wishlistToCart/fulfilled") {
        dispatch(getWishlist(user._id));
        toast.success("All products are added to cart");
      } else {
        toast.error(res.payload);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <Title text1="Your" text2="wishlist" />
        <span className="text-gray-600">
          {wishlist?.length || 0} {wishlist?.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  Select
                </th> */}
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Availability
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {wishlist?.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded text-green-600 focus:ring-green-500"
                    />
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                        {/* <div className="text-sm text-gray-500">{item.category}</div> */}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${item.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.stockStatus == "In Stock"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.stockStatus == "In Stock"
                        ? "In Stock"
                        : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      disabled={isDeletingId === item._id}
                      className={`inline-flex items-center justify-center p-1 rounded-md ${
                        isDeletingId === item._id
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-red-600 hover:text-red-900 hover:bg-red-50"
                      } transition-colors duration-200`}
                      aria-label="Remove item"
                    >
                      {isDeletingId === item._id ? (
                        <svg
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {wishlist?.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              Your wishlist is empty
            </h3>
            <p className="mt-1 text-gray-500">Start adding items you love!</p>
            <div className="mt-6">
              <a
                href="/collection"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Browse Products
              </a>
            </div>
          </div>
        )}

        {wishlist?.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">

            {/* <div className="flex items-center space-x-4 w-full sm:w-auto">
              <select
                value={selectedAction}
                onChange={handleActionChange}
                className="block w-full sm:w-48 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
              >
                <option value="">Choose action</option>
                <option value="addToCart">Add to cart</option>
                <option value="removeFromWishlist">Remove selected</option>
              </select>
              <button
                onClick={handleApplyAction}
                disabled={!selectedAction || isProcessing}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                  !selectedAction || isProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } transition-colors duration-200`}
              >
                {isProcessing ? "Processing..." : "Apply Action"}
              </button>
            </div> */}

            <button
              onClick={handleAddAllToCart}
              disabled={wishlist?.length === 0 || isProcessing}
              className={`px-6 py-2 rounded-md text-sm font-medium text-white ${
                wishlist?.length === 0 || isProcessing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition-colors duration-200`}
            >
              {isProcessing ? "Processing..." : "Add All to Cart"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
