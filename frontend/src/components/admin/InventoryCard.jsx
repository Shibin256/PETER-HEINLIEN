import React, { useState } from 'react';

const InventoryCard = ({ title, lastUpdated, totalCollection, editClick, deleteClick }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 mb-6">
    <div className="p-6">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <span className={`${totalCollection ? 'bg-blue-100  text-blue-800' : 'bg-red-100  text-red-800'} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
          {totalCollection} items
        </span>
      </div>
      <p className="mt-2 text-gray-500 text-sm">
        Last updated: <span className="font-medium">{lastUpdated}</span>
      </p>
      <div className="mt-4 flex space-x-2">

        {editClick && (
          <button onClick={editClick} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Edit
          </button>
        )}
        {deleteClick&&(
            <button onClick={deleteClick} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          Delete
        </button>
        )}
        
      </div>
    </div>
  </div>
);

export default InventoryCard