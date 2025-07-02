import React from 'react';

const CheckoutCard = ({ productName, deliveryDate, price, imageUrl, quantity, onQuantityChange }) => {
  return (
    <div className="border p-4 rounded shadow">
      <div className="flex items-center">
        <img src={imageUrl} alt={productName} className="w-24 h-24 mr-4" />
        <div>
          <h3 className="font-bold">{productName}</h3>
          <p className="text-green-600">Delivery by {deliveryDate} | FREE</p>
          <p className="text-green-600">10% OFF ONE COUPON APPLIED</p>
          <p>Price : {price} Rs</p>
          <div className="flex items-center mt-2">
            <button className="border px-2" onClick={() => onQuantityChange(quantity - 1)}>-</button>
            <span className="border px-4 py-1 mx-2">{quantity}</span>
            <button className="border px-2" onClick={() => onQuantityChange(quantity + 1)}>+</button>
            <select className="border px-4 py-1 ml-2">
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCard;