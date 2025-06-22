import React, { useEffect, useState } from 'react';
import Title from '../../components/common/Title';
import ProductCard from '../../components/common/ProductCard';
import { fetchProducts, getBrandAndCollection } from '../../features/products/productSlice';
import { useDispatch, useSelector } from 'react-redux';

const Collection = () => {
  const dispatch = useDispatch();

  const [showFilter, setShowFilter] = useState(false);
  const [category, setCategory] = useState([]);
  const [brand, setBrands] = useState([]);
  const [sortType, setSortType] = useState('');
  const [alphabeticOrder, setAlphabeticOrder] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { products, page, totalPages, brands, categories } = useSelector(state => state.products);

  // Fetch initial data
  useEffect(() => {
    dispatch(getBrandAndCollection());
  }, [dispatch]);

  // Fetch filtered products
  const fetchFilteredProducts = (pageNumber = 1) => {
    setCurrentPage(pageNumber);
    dispatch(fetchProducts({
      page: pageNumber,
      limit: 3,
      search: '',
      categories: category,
      brands: brand,
      sort: sortType === 'low-high' || sortType === 'high-low' ? 'price' : '',
      order: sortType === 'low-high' ? 'asc' : sortType === 'high-low' ? 'desc' : alphabeticOrder === 'a-z' ? 'asc' : alphabeticOrder === 'z-a' ? 'desc' : ''
    }));
  };

  // Filters + sorting effect
  useEffect(() => {
    fetchFilteredProducts(1); // Reset to page 1 on filter/sort change
  }, [category, brand, sortType, alphabeticOrder]);

  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };

  const toggleBrand = (e) => {
    const value = e.target.value;
    setBrands(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Left Filters */}
        <div className="lg:w-72 xl:w-80">
          <div
            className="my-2 text-xl flex items-center cursor-pointer gap-2 lg:cursor-auto"
            onClick={() => setShowFilter(!showFilter)}
          >
            <span>FILTERS</span>
            <svg className={`w-4 h-4 transition-transform duration-300 ${showFilter ? 'rotate-90' : ''} lg:hidden`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <div className={`${showFilter ? 'block' : 'hidden'} lg:block space-y-6`}>
            {/* Category Filter */}
            <div className="border border-gray-300 p-5 rounded">
              <p className="mb-3 text-sm font-medium uppercase">Categories</p>
              <div className="flex flex-col gap-2 text-sm text-gray-700">
                {categories.map((cat) => (
                  <label className="flex items-center gap-2" key={cat._id}>
                    <input
                      type="checkbox"
                      value={cat._id}
                      onChange={toggleCategory}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span>{cat.categoryName}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="border border-gray-300 p-5 rounded">
              <p className="mb-3 text-sm font-medium uppercase">Brands</p>
              <div className="flex flex-col gap-2 text-sm text-gray-700">
                {brands.map((br) => (
                  <label className="flex items-center gap-2" key={br._id}>
                    <input
                      type="checkbox"
                      value={br._id}
                      onChange={toggleBrand}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span>{br.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Alphabetic Sort */}
            <div className="border border-gray-300 pl-5 py-3 mt-6">
              <select
                onChange={(e) => setAlphabeticOrder(e.target.value)}
                className="text-sm px-2 py-1 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Alphabetic order</option>
                <option value="a-z">A - Z</option>
                <option value="z-a">Z - A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Product Grid */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <Title text1={'ALL'} text2={'COLLECTIONS'} />
            <select
              onChange={(e) => setSortType(e.target.value)}
              className="w-full sm:w-auto border-2 border-gray-300 text-sm px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sort by: Relevant</option>
              <option value="low-high">Sort by: High to Low</option>
              <option value="high-low">Sort by: Low to High</option>
            </select>
          </div>

          {/* Products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 justify-items-center">
            {products.map((product) => (
              <div key={product._id} className="w-full max-w-[280px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={currentPage <= 1}
              onClick={() => fetchFilteredProducts(currentPage - 1)}
              className={`px-4 py-2 rounded ${currentPage <= 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
            >
              Previous
            </button>

            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => fetchFilteredProducts(currentPage + 1)}
              className={`px-4 py-2 rounded ${currentPage >= totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
