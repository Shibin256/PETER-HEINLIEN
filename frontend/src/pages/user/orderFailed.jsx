import { useLocation, useNavigate } from "react-router-dom";
import { XCircleIcon } from "@heroicons/react/24/solid";

export default function OrderFailed() {
  const navigate = useNavigate();
  const location = useLocation();
  let { cartItems, totalPrice, shippingCost, userId } = location.state || {};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <XCircleIcon className="w-20 h-20 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Failed
        </h1>
        <p className="text-gray-600 mb-6">
          Oops! Something went wrong while processing your payment. Please try
          again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() =>
              navigate("/checkout", {
                state: {
                  cartItems: cartItems,
                  totalPrice: totalPrice,
                  shippingCost: shippingCost,
                  userId: userId,
                },
              })
            }
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition-all"
          >
            Go to Checkout
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg shadow transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}
