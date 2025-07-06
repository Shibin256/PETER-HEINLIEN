// pages/user/MyOrders.jsx
import React, { useEffect } from 'react';
import Title from '../../components/common/Title';
import Order from '../../components/user/order';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders } from '../../features/orders/ordersSlice';

const MyOrders = () => {
  const dispatch = useDispatch()
  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    dispatch(getOrders(user._id))
  }, []);

  const refetchOrders = () => {
    if (user?._id) {
      dispatch(getOrders(user._id));
    }
  };

  const { orders } = useSelector((state) => state.orders);

  return (
    <div className="px-4 md:px-10 py-6">
      <Title text1={"Orders"} text2={'List'} />
      {orders
        .map((order, idx) => (
          <Order key={idx} order={order} onCancelSuccess={refetchOrders} />
        ))}
    </div>
  );
};

export default MyOrders;
