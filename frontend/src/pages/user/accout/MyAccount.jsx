import React from 'react';
import { useNavigate } from 'react-router-dom';
import Title from '../../../components/common/Title';
import AccountCard from '../../../components/user/AccountCard';
import myOrders from '../../../assets/myOrders.png';
import password from '../../../assets/passwordAndSecurity.png';
import address from '../../../assets/address.png';
import coupon from '../../../assets/coupon.png';
import wallet from '../../../assets/wallet.png';
import contact from '../../../assets/contact.png';
import { toast } from 'react-toastify';
import { logout } from '../../../features/auth/authSlice';
import { useDispatch } from 'react-redux';

const MyAccount = () => {
  const navigate = useNavigate();
   const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <div className="py-10 px-5 sm:px-10 bg-gray-50 min-h-screen">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-12">

          {/* Title Section */}
          <div>
            <Title text1={'My'} text2={'Account'} />
            <p className="text-gray-500 max-w-lg mt-1">
              Manage your account settings, orders, and personal information
            </p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="
              flex items-center gap-2
              bg-white border border-gray-200
              px-5 py-2.5 rounded-xl
              shadow-sm hover:shadow-md
              hover:bg-red-50 hover:border-red-200
              transition-all duration-300
              group
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 group-hover:text-red-500 transition"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>

            <span className="text-sm font-semibold text-gray-600 group-hover:text-red-500 hidden sm:block">
              Logout
            </span>
          </button>

        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <AccountCard
            icon={<img src={myOrders} alt="Orders" className="rounded-md" />}
            title="MY ORDERS"
            description="Track, return, or buy things again"
            onclickFun={() => navigate('/my-orders')}
          />

          <AccountCard
            icon={<img src={password} alt="Security" className="rounded-md" />}
            title="PASSWORD & SECURITY"
            description="Edit login, name, and mobile number"
            onclickFun={() => navigate('/my-profile')}
          />

          <AccountCard
            icon={<img src={address} alt="Address" className="rounded-md" />}
            title="ADDRESS"
            description="Edit addresses for orders and gifts"
            onclickFun={() => navigate('/my-address')}
          />

          <AccountCard
            icon={<img src={coupon} alt="Coupons" className="rounded-md" />}
            title="COUPONS"
            description="Get exciting offers and discounts"
            onclickFun={() => navigate('/coupons')}
          />

          <AccountCard
            icon={<img src={contact} alt="Contact" className="rounded-md" />}
            title="CONTACT US"
            description="Reach our customer service team"
            onclickFun={() => navigate('/contact')}
          />

          <AccountCard
            icon={<img src={wallet} alt="Wallet" className="rounded-md" />}
            title="WALLET"
            description="View balance and add money"
            onclickFun={() => navigate('/wallet')}
          />

        </div>

      </div>

    </div>
  );
};

export default MyAccount;