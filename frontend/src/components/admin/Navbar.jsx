// components/Navbar.jsx
import React from "react";
import { HiArrowLeftOnRectangle } from "react-icons/hi2";

const AdminNav = ({ onLogout }) => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-900 border-b border-gray-700 ">
      <div className="flex items-center">
        <div className="w-8 h-8 mr-3 flex items-center justify-center text-white">
          PH
        </div>
        <span className="text-xl font-bold text-white">Peter Heinlein</span>
      </div>
      <button
        onClick={onLogout}
        className="flex items-center bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-lg transition-colors duration-200"
      >
        <HiArrowLeftOnRectangle className="mr-2" />
        Logout
      </button>
    </div>
  );
};

export default AdminNav;
