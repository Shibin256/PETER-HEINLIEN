import React from 'react';

const GenericTable = ({ title, columns, data, renderActions }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
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
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.key} className="py-2 px-4 border-b">
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
                  No data available
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