// pages/user/MyOrders.jsx
import React, { useEffect, useState } from "react";
import Title from "../../components/common/Title";
import Order from "../../components/user/order";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../../features/orders/ordersSlice";
import AuthInput from "../../components/common/AuthInput";

const MyOrders = () => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    dispatch(getOrders({ userId: user._id, search: "", page: 1, limit: 4 }));
  }, []);

  const refetchOrders = () => {
    if (user?._id) {
      dispatch(
        getOrders({ userId: user._id, search: searchTerm, page: 1, limit: 4 }),
      );
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(
      getOrders({ userId: user._id, search: searchTerm, page: 1, limit: 4 }),
    );
  };

  const { orders, page, totalPage } = useSelector((state) => state.orders);
  console.log(orders, "in orders of myorder");

  return (
    <div className="px-4 md:px-10 py-6">
      <Title text1={"Orders"} text2={"List"} />
      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <AuthInput
            type="text"
            name="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search orders by name..."
            width="w-full md:w-96"
            Textcolor="text-gray-700"
            borderColor="border-gray-300"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Search
          </button>
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                dispatch(getOrders({ userId: user._id, search: "" }));
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Clear
            </button>
          )}
        </form>
      </div>
      {orders.map((order, idx) => (
        <Order key={idx} order={order} onCancelSuccess={refetchOrders} />
      ))}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={page <= 1}
          onClick={() =>
            dispatch(
              getOrders({
                userId: user._id,
                page: page - 1,
                limit: 4,
                search: searchTerm,
              }),
            )
          }
          className={`px-4 py-2 rounded ${page <= 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
        >
          Previous
        </button>

        <span className="text-sm text-gray-700">
          Page {page} of {totalPage}
        </span>

        <button
          disabled={page >= totalPage}
          onClick={() =>
            dispatch(
              getOrders({
                userId: user._id,
                page: page + 1,
                limit: 4,
                search: searchTerm,
              }),
            )
          }
          className={`px-4 py-2 rounded ${page >= totalPage ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MyOrders;
