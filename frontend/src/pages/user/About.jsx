import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    new: false,
    featured: false,
    status: false,
    price: '',
    stock: '',
    offerPrice: '',
    image: '',
    description: '',
    quantity: '',
    couponID: ''
  });
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch brands and categories for dropdowns
  useEffect(() => {
    const fetchBrandsAndCategories = async () => {
      try {
        const [brandsResponse, categoriesResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/brands'), 
          axios.get('http://localhost:5000/api/categories') 
        ]);
        setBrands(brandsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (err) {
        setError('Error fetching brands or categories');
      }
    };
    fetchBrandsAndCategories();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/api/products', {
        ...formData,
        image: formData.image ? [formData.image] : [], // Convert single image URL to array
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        offerPrice: parseFloat(formData.offerPrice) || parseFloat(formData.price),
        quantity: parseInt(formData.quantity) || 0
      });
      setSuccess(response.data.message);
      // Reset form
      setFormData({
        name: '',
        category: '',
        brand: '',
        new: false,
        featured: false,
        status: false,
        price: '',
        stock: '',
        offerPrice: '',
        image: '',
        description: '',
        quantity: '',
        couponID: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding product');
    }
  };

  return (
    <div>
      <h1>Add Product</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Brand:</label>
          <select name="brand" value={formData.brand} onChange={handleChange} required>
            <option value="">Select Brand</option>
            {brands.map(brand => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="new"
              checked={formData.new}
              onChange={handleChange}
            />
            New Product
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
            />
            Featured
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleChange}
            />
            Active Status
          </label>
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            step="0.01"
          />
        </div>
        <div>
          <label>Stock:</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Offer Price:</label>
          <input
            type="number"
            name="offerPrice"
            value={formData.offerPrice}
            onChange={handleChange}
            step="0.01"
          />
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Coupon ID (optional):</label>
          <input
            type="text"
            name="couponID"
            value={formData.couponID}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;