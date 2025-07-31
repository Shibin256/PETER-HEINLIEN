import React from 'react';

const InventoryCard = ({ 
    title, 
    lastUpdated, 
    totalCollection, 
    editClick, 
    deleteClick,
    offerClick,
    removeOfferClick,
    hasOffer,
    offerPercentage
}) => {
    return (
        <div className={`bg-white p-6 rounded-xl shadow-sm border ${hasOffer ? 'border-green-200' : 'border-gray-100'}`}>
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    {title}
                    {hasOffer && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                            {offerPercentage}% OFF
                        </span>
                    )}
                </h3>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={editClick}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                    <button
                        onClick={deleteClick}
                        className="text-red-600 hover:text-red-800"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                    {offerClick && (
                        <button
                            onClick={hasOffer? removeOfferClick: offerClick}
                            className={`${hasOffer ? 'text-yellow-600 hover:text-yellow-800' : 'text-gray-600 hover:text-gray-800'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                            </svg>
                        </button>
                    )}
                </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
                <span>Last updated: {lastUpdated}</span>
                <span>{totalCollection} items</span>
            </div>
        </div>
    );
};

export default InventoryCard;