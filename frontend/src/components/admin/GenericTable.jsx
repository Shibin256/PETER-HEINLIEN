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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="border px-4 py-2 rounded w-full md:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              {columns.map((column) => (
                <th key={column.key} className="py-2 px-4 border-b text-left">
                  {column.label}
                </th>
              ))}
              {renderActions && (
                <th className="py-2 px-4 border-b text-left">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item._id || item.id} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={`${item._id || item.id}-${column.key}`} className="py-2 px-4 border-b">
                      {column.render
                        ? column.render(item[column.key], item)
                        : item[column.key]}
                    </td>
                  ))}

                  {renderActions && (
                    <td className="py-2 px-4 border-b">
                      {renderActions(item)}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (renderActions ? 1 : 0)}
                  className="py-2 px-4 border-b text-center"
                >
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenericTable;
