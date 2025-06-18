import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, fetchProducts, getBrandAndCollection, updateProduct } from '../../features/products/productSlice';
import { toast } from 'react-toastify';
import AuthInput from '../../components/common/AuthInput';
import SelectInput from '../../components/common/SelectInput';
import { useNavigate } from 'react-router-dom';

const ProductAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getBrandAndCollection());
  }, [])

  const { brands, categories, products, loading, error } = useSelector((state) => state.products);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    quantity: '',
    price: '',
    category: '',
    brand: '',
    tags: '',
  });
  //states for front end side handling pagination 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products?.length / itemsPerPage);

  //fetching product form server
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  //handling edit popup
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditForm({
      name: product.name || '',
      description: product.description || '',
      quantity: product.totalQuantity || '',
      price: product.price || '',
      category: product.category || '',
      brand: product.brand || '',
      tags: product.tags || '',
    });
    setShowEditModal(true);
  };

  //handling edit submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { name, description, quantity, price, category, brand, tags } = editForm;

    if (!name || !description || !quantity || !price || !tags) {
      toast.error('Please fill all fields.');
      return;
    }

    if (isNaN(price) || price <= 0) {
      toast.error('Price must be a valid number.');
      return;
    }

    if (isNaN(quantity) || quantity < 0) {
      toast.error('Quantity must be a valid number.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('quantity', quantity);
    formData.append('price', price);
    formData.append('category', category._id);
    formData.append('brand', brand._id);
    formData.append('tags', tags);

    try {
      //updating the product
      await dispatch(updateProduct({ id: selectedProduct._id, data: formData })).unwrap();
      toast.success('✅ Product updated successfully!');
      setShowEditModal(false);
      setSelectedProduct(null);
      dispatch(fetchProducts()).unwrap();
      navigate('/admin/products')
    } catch (error) {
      toast.error(error?.message || 'Failed to update product.');
    }
  };

  //handling delete product using 
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id)).then((res) => {
        if (res.type.endsWith('/fulfilled')) {
          dispatch(fetchProducts());
        }
      });
    }
  };
  //handling cancle in edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedProduct(null);
  };

  //getting brands and category from the backend and using its id and name
  const categoryOptions = categories.map((category) => ({
    label: category.categoryName, 
    value: category._id
  }))

  const brandOptions = brands.map((brand) => ({
    label: brand.name, 
    value: brand._id
  }))

  if (loading) return <p className="text-center py-4">Loading products...</p>;
  if (error) {
    const errorMessage = typeof error === 'string' ? error : error?.message || 'An unknown error occurred.';
    return <p className="text-red-500 text-center">{errorMessage}</p>;
  }



  return (
    <div className="px-6 py-4">
      <h2 className="text-2xl font-bold mb-4">Product List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200 text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b">Image</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Quantity</th>
              <th className="px-4 py-2 border-b">Availability</th>
              <th className="px-4 py-2 border-b">Category</th>
              <th className="px-4 py-2 border-b">Price</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts?.map((product) => (

              <tr key={product._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 ">
                  <img src={product.images[0]} alt="Product" className="w-12 h-12 object-cover rounded" />
                </td>
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">{product.totalQuantity}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${product.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {product.availability ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="px-4 py-2">{product.category.categoryName}</td>
                <td className="px-4 py-2">${product.price?.toFixed(2)}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100'
                } hover:bg-blue-500 hover:text-white`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>

      </div>

      {/* Edit Modal */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-black">Edit Product</h2>
            <form onSubmit={handleEditSubmit}>
              <AuthInput
                label="Product Name"
                type="text"
                name="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Enter product name"
                width="w-full"
                Textcolor="text-gray-700"
                borderColor="border-gray-300"
              />

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  rows="4"
                  placeholder="Enter detailed product description..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <SelectInput
                  label="Category"
                  value={editForm.category}
                  onChange={(value) => setEditForm({ ...editForm, category: value })}
                  options={categoryOptions}
                  name="category"
                />
                <SelectInput
                  label="Brand"
                  value={editForm.brand}
                  onChange={(value) => setEditForm({ ...editForm, brand: value })}
                  options={brandOptions}
                  name="brand"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <AuthInput
                  label="Tags"
                  type="text"
                  name="tags"
                  value={editForm.tags}
                  onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                  placeholder="e.g., new, sale, trendy"
                  width="w-full"
                  Textcolor="text-gray-700"
                  borderColor="border-gray-300"
                />
                <AuthInput
                  label="Price"
                  type="number"
                  name="price"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  placeholder="Enter the amount"
                  width="w-full"
                  Textcolor="text-gray-700"
                  borderColor="border-gray-300"
                  icon="$"
                />
                <AuthInput
                  label="Quantity"
                  type="number"
                  name="quantity"
                  value={editForm.quantity}
                  onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                  placeholder="Enter the Quantity"
                  width="w-full"
                  Textcolor="text-gray-700"
                  borderColor="border-gray-300"
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="py-2 px-6 rounded-full text-gray-700 font-semibold border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-6 rounded-full text-white font-semibold bg-blue-600 hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAdmin;
