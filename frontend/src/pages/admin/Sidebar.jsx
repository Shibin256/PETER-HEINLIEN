import React from 'react'
import { 
  HiHome, HiPlusCircle, HiListBullet, HiShoppingBag, 
  HiUsers, HiArchiveBox, HiTicket, HiCog6Tooth,
  HiGift, HiRectangleGroup, HiStar, HiArrowLeftOnRectangle 
} from "react-icons/hi2";

const AdminSidebar = () => {
  const [activeItem, setActiveItem] = React.useState("Dashboard");

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
    // Add your custom logic here for each button click
    console.log(`${itemName} clicked`);
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    // Add your logout logic here
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-gray-200 flex flex-col border-r border-gray-800">
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        {/* Individual buttons instead of mapped items */}
        <button
          onClick={() => handleItemClick("Dashboard")}
          className={`w-full flex items-center px-6 py-3 transition-colors duration-200 ${
            activeItem === "Dashboard"
              ? 'bg-gray-800 text-white border-l-4 border-blue-500' 
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <HiHome className="mr-3 text-blue-400 text-lg" />
          <span className="font-medium">Dashboard</span>
        </button>

        <button
          onClick={() => handleItemClick("Add Items")}
          className={`w-full flex items-center px-6 py-3 transition-colors duration-200 ${
            activeItem === "Add Items"
              ? 'bg-gray-800 text-white border-l-4 border-blue-500' 
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <HiPlusCircle className="mr-3 text-blue-400 text-lg" />
          <span className="font-medium">Add Items</span>
        </button>

        <button
          onClick={() => handleItemClick("List Items")}
          className={`w-full flex items-center px-6 py-3 transition-colors duration-200 ${
            activeItem === "List Items"
              ? 'bg-gray-800 text-white border-l-4 border-blue-500' 
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <HiListBullet className="mr-3 text-blue-400 text-lg" />
          <span className="font-medium">List Items</span>
        </button>

        {/* Continue with other buttons in the same pattern */}
        <button
          onClick={() => handleItemClick("Orders")}
          className={`w-full flex items-center px-6 py-3 transition-colors duration-200 ${
            activeItem === "Orders"
              ? 'bg-gray-800 text-white border-l-4 border-blue-500' 
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <HiShoppingBag className="mr-3 text-blue-400 text-lg" />
          <span className="font-medium">Orders</span>
        </button>

        <button
          onClick={() => handleItemClick("Customers")}
          className={`w-full flex items-center px-6 py-3 transition-colors duration-200 ${
            activeItem === "Customers"
              ? 'bg-gray-800 text-white border-l-4 border-blue-500' 
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <HiUsers className="mr-3 text-blue-400 text-lg" />
          <span className="font-medium">Customers</span>
        </button>

        <button
          onClick={() => handleItemClick("Inventory")}
          className={`w-full flex items-center px-6 py-3 transition-colors duration-200 ${
            activeItem === "Inventory"
              ? 'bg-gray-800 text-white border-l-4 border-blue-500' 
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <HiArchiveBox className="mr-3 text-blue-400 text-lg" />
          <span className="font-medium">Inventory</span>
        </button>

        <button
          onClick={() => handleItemClick("Coupons")}
          className={`w-full flex items-center px-6 py-3 transition-colors duration-200 ${
            activeItem === "Coupons"
              ? 'bg-gray-800 text-white border-l-4 border-blue-500' 
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <HiTicket className="mr-3 text-blue-400 text-lg" />
          <span className="font-medium">Coupons</span>
        </button>

        <button
          onClick={() => handleItemClick("Settings")}
          className={`w-full flex items-center px-6 py-3 transition-colors duration-200 ${
            activeItem === "Settings"
              ? 'bg-gray-800 text-white border-l-4 border-blue-500' 
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <HiCog6Tooth className="mr-3 text-blue-400 text-lg" />
          <span className="font-medium">Settings</span>
        </button>

        <button
          onClick={() => handleItemClick("Offers")}
          className={`w-full flex items-center px-6 py-3 transition-colors duration-200 ${
            activeItem === "Offers"
              ? 'bg-gray-800 text-white border-l-4 border-blue-500' 
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <HiGift className="mr-3 text-blue-400 text-lg" />
          <span className="font-medium">Offers</span>
        </button>

        <button
          onClick={() => handleItemClick("Banners")}
          className={`w-full flex items-center px-6 py-3 transition-colors duration-200 ${
            activeItem === "Banners"
              ? 'bg-gray-800 text-white border-l-4 border-blue-500' 
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <HiRectangleGroup className="mr-3 text-blue-400 text-lg" />
          <span className="font-medium">Banners</span>
        </button>

        <button
          onClick={() => handleItemClick("Reviews")}
          className={`w-full flex items-center px-6 py-3 transition-colors duration-200 ${
            activeItem === "Reviews"
              ? 'bg-gray-800 text-white border-l-4 border-blue-500' 
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <HiStar className="mr-3 text-blue-400 text-lg" />
          <span className="font-medium">Reviews</span>
        </button>
      </nav>
      
    </div>
  );
};

export default AdminSidebar