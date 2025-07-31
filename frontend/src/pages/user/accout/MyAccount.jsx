

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Title from '../../../components/common/Title';
import AccountCard from '../../../components/user/AccountCard';
import myOrders from '../../../assets/myOrders.png'
import password from '../../../assets/passwordAndSecurity.png'
import address from '../../../assets/address.png'
import coupon from '../../../assets/coupon.png'
import wallet from '../../../assets/wallet.png'
import contact from '../../../assets/contact.png'


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
            icon={<img src={myOrders} alt="Orders" className="rounded-md" />}
            title="MY ORDERS"
            description="Track, return, or buy things again"
            onclickFun={() => {navigate('/my-orders')}}
          />

          <AccountCard
            icon={<img src={password} alt="Security" className="rounded-md" />}
            title="PASSWORD & SECURITY"
            description="Edit login, name, and mobile number"
            onclickFun={() => {navigate('/my-profile')}}
          />

          <AccountCard
            icon={<img src={address} alt="Address" className="rounded-md" />}
            title="ADDRESS"
            description="Edit addresses for orders and gifts"
            onclickFun={() => {navigate('/my-address')}}
          />

          <AccountCard
            icon={<img src={coupon} alt="Coupons" className="rounded-md" />}
            title="COUPONS"
            description="Get exciting offers and discounts"
            onclickFun={() => {}}
          />

          <AccountCard
            icon={<img src={contact} alt="Contact" className="rounded-md" />}
            title="CONTACT US"
            description="Reach our customer service team"
            onclickFun={() => {navigate('/contact')}}
          />

          <AccountCard
            icon={<img src={wallet} alt="Wallet" className="rounded-md" />}
            title="WALLET"
            description="View balance and add money"
            onclickFun={() => {navigate('/wallet')}}
          />
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
