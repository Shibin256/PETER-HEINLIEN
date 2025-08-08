import React, { useEffect, useState } from "react";
import {
  HiHome,
  HiPlusCircle,
  HiListBullet,
  HiShoppingBag,
  HiUsers,
  HiArchiveBox,
  HiTicket,
  HiCog6Tooth,
  HiRectangleGroup,
  HiStar,
  HiBars3,
} from "react-icons/hi2";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", icon: HiHome, path: "/admin/dashboard" },
  { name: "Add Items", icon: HiPlusCircle, path: "/admin/additems" },
  { name: "List Items", icon: HiListBullet, path: "/admin/products" },
  { name: "Orders", icon: HiShoppingBag, path: "/admin/orders" },
  { name: "Customers", icon: HiUsers, path: "/admin/user-list" },
  { name: "Inventory", icon: HiArchiveBox, path: "/admin/inventory" },
  { name: "Coupons", icon: HiTicket, path: "/admin/coupons" },
  { name: "Settings", icon: HiCog6Tooth, path: "/admin/settings" },
  // { name: "Offers", icon: HiGift, path: "/admin/offers" },
  { name: "Banners", icon: HiRectangleGroup, path: "/admin/banners" },
  // { name: "Reviews", icon: HiStar, path: "/admin/reviews" },
];

const AdminSidebar = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  //change active item it when path name change
  useEffect(() => {
    const currentItem = menuItems.find((item) =>
      location.pathname.startsWith(item.path),
    );
    if (currentItem) {
      setActiveItem(currentItem.name);
    }
  }, [location.pathname]);

  const handleItemClick = (name, path) => {
    setActiveItem(name);
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        <HiBars3 className="text-2xl" />
      </button>

      <div
        className={`
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        md:static fixed
        top-0 left-0 z-40
        w-64 h-screen
        bg-gray-900 text-gray-200 flex flex-col border-r border-gray-800
        transition-transform duration-300 ease-in-out
      `}
      >
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
          {menuItems.map(({ name, icon: Icon, path }) => (
            <button
              key={name}
              onClick={() => handleItemClick(name, path)}
              className={`w-full flex items-center px-6 py-3 transition-colors duration-200 ${
                activeItem === name
                  ? "bg-gray-800 text-white border-l-4 border-blue-500"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="mr-3 text-blue-400 text-lg" />
              <span className="font-medium">{name}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
