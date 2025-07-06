import React, { useState, useMemo } from 'react';

const GenericTable = ({ title, columns, data, renderActions }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lower = searchTerm.toLowerCase();
    return data.filter((item) =>
      columns.some((col) => {
        const val = item[col.key];
        return typeof val === 'string' && val.toLowerCase().includes(lower);
      })
    );
  }, [searchTerm, data, columns]);

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          {title}
        </h1>
        
        {/* Search bar */}
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th 
                    key={column.key} 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      {column.label}
                      {column.sortable && (
                        <button className="ml-1 focus:outline-none">
                          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </th>
                ))}
                {renderActions && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr 
                    key={item._id || item.id} 
                    className={`transition-all duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}
                  >
                    {columns.map((column) => (
                      <td 
                        key={`${item._id || item.id}-${column.key}`} 
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                      >
                        {column.render
                          ? column.render(item[column.key], item)
                          : item[column.key]}
                      </td>
                    ))}

                    {renderActions && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          {renderActions(item)}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + (renderActions ? 1 : 0)}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <svg className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-lg font-medium text-gray-600">No data found</span>
                      {searchTerm && (
                        <button 
                          onClick={() => setSearchTerm('')}
                          className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Optional pagination would go here */}
      {/* <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing 1 to 10 of 100 entries
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 border rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            1
          </button>
          <button className="px-3 py-1 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-1 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default GenericTable;