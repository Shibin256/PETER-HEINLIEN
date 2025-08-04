import React from "react";

const CheckoutCard = ({
  productName,
  deliveryDate,
  price,
  imageUrl,
  quantity,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg shadow-md p-4 mb-4 bg-white hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center">
        {/* Product Image */}
        <img
          src={imageUrl}
          alt={productName}
          className="w-28 h-28 object-cover rounded-md border border-gray-100 mb-4 sm:mb-0 sm:mr-5"
        />

        {/* Product Details */}
        <div className="flex-1 w-full">
          <h3 className="text-lg font-semibold text-gray-800">{productName}</h3>
          <p className="text-sm text-green-600 mt-1">
            Delivery by <span className="font-medium">{deliveryDate}</span> |{" "}
            <span className="font-semibold">FREE</span>
          </p>

          {/* Price */}
          <p className="text-gray-700 mt-2">
            <span className="font-medium">Price:</span> ₹{price.toFixed(2)}
          </p>

          {/* Quantity */}
          <div className="mt-3">
            <span className="inline-block bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full border">
              Quantity: {quantity}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCard;
