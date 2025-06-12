// import React from 'react'
// import { useState } from 'react';

// // Sample product data
// const initialProducts = [
//   {
//     id: 1,
//     image: 'https://via.placeholder.com/50',
//     name: 'Wireless Mouse',
//     count: 25,
//     availability: 'In Stock',
//     category: 'Electronics',
//     price: 29.99,
//   },
//   {
//     id: 2,
//     image: 'https://via.placeholder.com/50',
//     name: 'Bluetooth Headphones',
//     count: 10,
//     availability: 'Low Stock',
//     category: 'Electronics',
//     price: 59.99,
//   },
//   {
//     id: 3,
//     image: 'https://via.placeholder.com/50',
//     name: 'Office Chair',
//     count: 5,
//     availability: 'Out of Stock',
//     category: 'Furniture',
//     price: 129.99,
//   },
// ];


// const ProductAdmin = () => {
//    const [products, setProducts] = useState(initialProducts);

//   // Handle Edit action
//   const handleEdit = (id) => {
//     alert(`Edit product with ID: ${id}`);
//     // Add logic to edit product (e.g., open a modal or redirect to edit page)
//   };

//   // Handle Delete action
//   const handleDelete = (id) => {
//     if (window.confirm(`Are you sure you want to delete product with ID: ${id}?`)) {
//       setProducts(products.filter((product) => product.id !== id));
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Product List</h1>
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-200">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="py-2 px-4 border-b text-left">Image</th>
//               <th className="py-2 px-4 border-b text-left">Name</th>
//               <th className="py-2 px-4 border-b text-left">Count</th>
//               <th className="py-2 px-4 border-b text-left">Availability</th>
//               <th className="py-2 px-4 border-b text-left">Category</th>
//               <th className="py-2 px-4 border-b text-left">Price</th>
//               <th className="py-2 px-4 border-b text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {products.length > 0 ? (
//               products.map((product) => (
//                 <tr key={product.id} className="hover:bg-gray-50">
//                   <td className="py-2 px-4 border-b">
//                     <img
//                       src={product.image}
//                       alt={product.name}
//                       className="w-12 h-12 object-cover"
//                     />
//                   </td>
//                   <td className="py-2 px-4 border-b">{product.name}</td>
//                   <td className="py-2 px-4 border-b">{product.count}</td>
//                   <td className="py-2 px-4 border-b">{product.availability}</td>
//                   <td className="py-2 px-4 border-b">{product.category}</td>
//                   <td className="py-2 px-4 border-b">${product.price.toFixed(2)}</td>
//                   <td className="py-2 px-4 border-b">
//                     <button
//                       onClick={() => handleEdit(product.id)}
//                       className="text-blue-600 hover:text-blue-800 mr-2"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(product.id)}
//                       className="text-red-600 hover:text-red-800"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="7" className="py-2 px-4 border-b text-center">
//                   No products available
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default ProductAdmin



import React, { useState } from 'react';
import GenericTable from '../../components/admin/GenericTable';

// Sample product data
const initialProducts = [
  {
    id: 1,
    image: 'https://via.placeholder.com/50',
    name: 'Wireless Mouse',
    count: 25,
    availability: 'In Stock',
    category: 'Electronics',
    price: 29.99,
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/50',
    name: 'Bluetooth Headphones',
    count: 10,
    availability: 'Low Stock',
    category: 'Electronics',
    price: 59.99,
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/50',
    name: 'Office Chair',
    count: 5,
    availability: 'Out of Stock',
    category: 'Furniture',
    price: 129.99,
  },
];

const ProductAdmin = () => {
  const [products, setProducts] = useState(initialProducts);

  // Define columns for products
  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (value) => (
        <img src={value} alt="Product" className="w-12 h-12 object-cover" />
      ),
    },
    { key: 'name', label: 'Name' },
    { key: 'count', label: 'Count' },
    { key: 'availability', label: 'Availability' },
    { key: 'category', label: 'Category' },
    {
      key: 'price',
      label: 'Price',
      render: (value) => `$${value.toFixed(2)}`,
    },
  ];

  // Define actions for products
  const renderActions = (product) => (
    <>
      <button
        onClick={() => alert(`Edit product with ID: ${product.id}`)}
        className="text-blue-600 hover:text-blue-800 mr-2"
      >
        Edit
      </button>
      <button
        onClick={() => {
          if (window.confirm(`Are you sure you want to delete product with ID: ${product.id}?`)) {
            setProducts(products.filter((p) => p.id !== product.id));
          }
        }}
        className="text-red-600 hover:text-red-800"
      >
        Delete
      </button>
    </>
  );

  return (
    <GenericTable
      title="Product List"
      columns={columns}
      data={products}
      renderActions={renderActions}
    />
  );
};

export default ProductAdmin;