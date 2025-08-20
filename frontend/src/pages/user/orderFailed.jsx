import { useLocation, useNavigate } from "react-router-dom";
import { XCircleIcon, ArrowPathIcon, HomeIcon, CreditCardIcon } from "@heroicons/react/24/solid";

export default function OrderFailed() {
  const navigate = useNavigate();
  const location = useLocation();
  let { cartItems, totalPrice, shippingCost, userId } = location.state || {};
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="bg-white shadow-xl rounded-3xl p-8 max-w-md w-full text-center transform transition-all duration-300 hover:shadow-2xl">
        <div className="animate-bounce">
          <XCircleIcon className="w-24 h-24 text-red-500 mx-auto mb-6 drop-shadow-md" />
        </div>
        
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-600">
            We couldn't process your payment. Please check your details or try another payment method.
          </p>
        </div>

        <div className="space-y-4">
          {/* <button
            onClick={() =>
              navigate("/checkout", {
                state: {
                  cartItems: cartItems,
                  totalPrice: totalPrice,
                  shippingCost: shippingCost,
                  userId: userId,
                  from:true
                },
              })
            }
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-1"
          >
            <CreditCardIcon className="w-5 h-5" />
            <span>Try Checkout Again</span>
          </button> */}

          <button
            onClick={() =>
              navigate("/my-orders")
            }
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-1"
          >
            <CreditCardIcon className="w-5 h-5" />
            <span>Go to Orders</span>
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl shadow-sm transition-all duration-300"
          >
            <ArrowPathIcon className="w-5 h-5" />
            <span>Retry Payment</span>
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl transition-all duration-300"
          >
            <HomeIcon className="w-5 h-5" />
            <span>Return Home</span>
          </button>
          
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Need help? <a href="/contact" className="text-red-500 hover:underline">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  );
}