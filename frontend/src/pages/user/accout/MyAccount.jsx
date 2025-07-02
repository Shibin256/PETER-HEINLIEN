

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Title from '../../../components/common/Title';
import AccountCard from '../../../components/user/AccountCard';
import image from '../../../assets/Footer.png'

const MyAccount = () => {

    const navigate = useNavigate()


  return (
    <div className="py-10 px-5 sm:px-10 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Title text1={'My'} text2={'Account'} />
          <p className="text-gray-500 max-w-lg mx-auto">
            Manage your account settings, orders, and personal information
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AccountCard
            icon={<img src={image} alt="Orders" className="rounded-md" />}
            title="MY ORDERS"
            description="Track, return, or buy things again"
            onclickFun={() => {}}
          />

          <AccountCard
            icon={<img src="path/to/lock-icon.png" alt="Security" className="w-6 h-6" />}
            title="PASSWORD & SECURITY"
            description="Edit login, name, and mobile number"
            onclickFun={() => {navigate('/my-profile')}}
          />

          <AccountCard
            icon={<img src="path/to/address-icon.png" alt="Address" className="w-6 h-6" />}
            title="ADDRESS"
            description="Edit addresses for orders and gifts"
            onclickFun={() => {navigate('/my-address')}}
          />

          <AccountCard
            icon={<img src="path/to/coupons-icon.png" alt="Coupons" className="w-6 h-6" />}
            title="COUPONS"
            description="Get exciting offers and discounts"
            onclickFun={() => {}}
          />

          <AccountCard
            icon={<img src="path/to/contact-icon.png" alt="Contact" className="w-6 h-6" />}
            title="CONTACT US"
            description="Reach our customer service team"
            onclickFun={() => {}}
          />

          <AccountCard
            icon={<img src="path/to/wallet-icon.png" alt="Wallet" className="w-6 h-6" />}
            title="WALLET"
            description="View balance and add money"
            onclickFun={() => {}}
          />
        </div>

        <div className="mt-12 text-center">
          <button className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-300 shadow-sm hover:shadow-md">
            View Account Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
