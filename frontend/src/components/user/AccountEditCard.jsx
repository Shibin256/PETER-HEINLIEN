import React, { useState } from 'react';

const AccountEditCard = ({ title, description, placeholder, inputValue,type, onBack, onVerify,onVerifyButtonName,onBackButtonName }) => {
  const [value, setvalue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onVerify) onVerify(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#003543]/5 to-white py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300">
        {/* Header Section */}
        <div className="bg-[#003543] py-5 px-6 text-center">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <p className="text-gray-600 mb-6 text-center">{description}</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type={type}
                value={inputValue}
                onChange={(e) => setvalue(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003543]/50 focus:border-[#003543] transition-all duration-300"
                autoFocus
              />
              {/* <div className="absolute right-3 top-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div> */}
            </div>

            <div className="flex justify-between space-x-4">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 px-4 py-3 bg-white text-[#003543] border border-[#003543] rounded-lg hover:bg-[#003543]/5 transition-colors duration-300 font-medium flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {onBackButtonName}
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-[#003543] text-white rounded-lg hover:bg-[#004d5f] transition-colors duration-300 font-medium flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {onVerifyButtonName}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountEditCard;