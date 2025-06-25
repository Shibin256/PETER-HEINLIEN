import React from 'react';

const AccountCard = ({ icon, title, description, onclickFun }) => (
  <button
    onClick={onclickFun}
    className="w-full text-left bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-green-200 transform hover:-translate-y-1 flex flex-col h-full focus:outline-none"
  >
    <div className="w-12 h-12 mb-4 flex items-center justify-center bg-green-50 rounded-lg text-green-600">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </button>
);

export default AccountCard;
