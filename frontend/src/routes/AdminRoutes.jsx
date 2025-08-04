import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AdminLayout from "../Layout/AdminLayout";
import AdminLogin from "../pages/admin/Login";
import Dashboard from "../pages/admin/Dashboard";
import AddItem from "../pages/admin/AddItem";
import Customer from "../pages/admin/Customer";
import ProductAdmin from "../pages/admin/ProductAdmin";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import UserList from "../pages/admin/UserList";
import Inventory from "../pages/admin/Inventory";
import Settings from "../pages/admin/Settings";
import Banners from "../pages/admin/Banners";
import OrdersList from "../pages/admin/OrdersList";
import Coupons from "../pages/admin/coupons";
import Offers from "../pages/admin/Offer";

const AdminRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("adminAccessToken");
    const isLoginPage = location.pathname === "/admin/login";

    if (token && isLoginPage) {
      // If already logged in and trying to access login, redirect to dashboard
      navigate("/admin/");
    }
  }, [location, navigate]);

  return (
    <div>
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route
          path="/"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="additems" element={<AddItem />} />
          <Route path="customers" element={<Customer />} />
          <Route path="orders" element={<OrdersList />} />
          <Route path="products" element={<ProductAdmin />} />
          <Route path="user-list" element={<UserList />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="settings" element={<Settings />} />
          <Route path="banners" element={<Banners />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="offers" element={<Offers />} />
        </Route>
      </Routes>
    </div>
  );
};

export default AdminRoutes;
