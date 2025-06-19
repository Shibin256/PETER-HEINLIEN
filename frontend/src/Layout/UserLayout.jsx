// layouts/UserLayout.jsx
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/user/Navbar';
import Footer from '../components/user/Footer';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosInstance';

const UserLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);

    const checkBlocked = async () => {
      try {
        const res = await axiosInstance.get(`/api/auth/me/${user._id}`);
        if (res.data.isBlocked) {
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          toast.error('You have been blocked. Logging out...');
          navigate('/login');
        }
      } catch (err) {
        console.error('Error checking user status:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        toast.error('Session expired. Logging out...');
        navigate('/login');
      }
    };

    // First check on mount
    checkBlocked();

    // Then check every 60 seconds
    const intervalId = setInterval(checkBlocked, 60000);

    // Clear interval on unmount
    return () => clearInterval(intervalId);
  }, [navigate]);

  return (
    <div className="flex flex-col font-serif min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
