import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from '../components/admin/Navbar';
import AdminSidebar from '../components/admin/Sidebar';
import { Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminAccessToken');  
    toast.success('Logged out successfully');
    navigate('/admin/login'); 
  };

  return (
    <div className="h-screen flex flex-col">
      <AdminNav onLogout={handleLogout} />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
