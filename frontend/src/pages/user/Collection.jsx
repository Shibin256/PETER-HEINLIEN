import React, { useEffect, useState } from 'react';
import { FiFilter, FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';
import Title from '../../components/common/Title';
import ProductCard from '../../components/common/ProductCard';
import { fetchProducts, getBrandAndCollection } from '../../features/products/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import AuthInput from '../../components/common/AuthInput';

const Collection = () => {
  const dispatch = useDispatch();

  const [showFilter, setShowFilter] = useState(false);
  const [category, setCategory] = useState([]);
  const [brand, setBrands] = useState([]);
  const [sortType, setSortType] = useState('');
  const [alphabeticOrder, setAlphabeticOrder] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');


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
      limit: 10,
      search: '',
      categories: category,
      brands: brand,
      sort: sortType === 'low-high' || sortType === 'high-low' ? 'price' : '',
      order: sortType === 'low-high' ? 'asc' : sortType === 'high-low' ? 'desc' : alphabeticOrder === 'a-z' ? 'asc' : alphabeticOrder === 'z-a' ? 'desc' : ''
    }));
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchProducts({ page: 1, limit: 10, search: searchTerm }));
  };

  // Filters + sorting effect
  useEffect(() => {
    fetchFilteredProducts(1); // Reset to page 1 on filter/sort change
  }, [category, brand, sortType, alphabeticOrder]);

  // Brand and category toggle
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
        {/* Left Filters - Enhanced Version */}
        <div className="lg:w-7 xl:w-80">
          <div
            className="my-2 text-xl flex items-center cursor-pointer gap-2 lg:cursor-auto"
            onClick={() => setShowFilter(!showFilter)}
          >
            <span>FILTERS</span>
            <svg className={`w-4 h-4 transition-transform duration-300 ${showFilter ? 'rotate-90' : ''} lg:hidden`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Filter Panel */}
          <div className={`${showFilter ? 'block' : 'hidden'} lg:block space-y-6 transition-all duration-300`}>
            {/* Clear All Button */}
            {(category.length > 0 || brand.length > 0) && (
              <button
                onClick={() => {
                  setCategory([]);
                  setBrands([]);
                  setSortType('');
                  setAlphabeticOrder('');
                }}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                <FiX size={14} />
                Clear all filters
              </button>
            )}

            {/* Category Filter */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Categories</p>
                {category.length > 0 && (
                  <span className="text-xs text-blue-600">{category.length} selected</span>
                )}
              </div>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label
                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${category.includes(cat._id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                    key={cat._id}
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        value={cat._id}
                        onChange={toggleCategory}
                        checked={category.includes(cat._id)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded flex items-center justify-center ${category.includes(cat._id) ? 'bg-blue-500 border-blue-500' : 'border-2 border-gray-300'}`}>
                        {category.includes(cat._id) && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-700">{cat.categoryName}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Brands</p>
                {brand.length > 0 && (
                  <span className="text-xs text-blue-600">{brand.length} selected</span>
                )}
              </div>
              <div className="space-y-2">
                {brands.map((br) => (
                  <label
                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${brand.includes(br._id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                    key={br._id}
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        value={br._id}
                        onChange={toggleBrand}
                        checked={brand.includes(br._id)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded flex items-center justify-center ${brand.includes(br._id) ? 'bg-blue-500 border-blue-500' : 'border-2 border-gray-300'}`}>
                        {brand.includes(br._id) && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-700">{br.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sorting Options */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Sort Options</p>

              <div className="mb-4">
                <label className="block text-xs text-gray-500 mb-1">Alphabetical Order</label>
                <select
                  onChange={(e) => setAlphabeticOrder(e.target.value)}
                  value={alphabeticOrder}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">None</option>
                  <option value="a-z">A - Z</option>
                  <option value="z-a">Z - A</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Price</label>
                <select
                  onChange={(e) => setSortType(e.target.value)}
                  value={sortType}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">None</option>
                  <option value="low-high">High to Low</option>
                  <option value="high-low">Low to High</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Product Grid */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <Title text1={'ALL'} text2={'COLLECTIONS'} />
            {/* Search Bar */}
            <div className="mb-4">
              <form onSubmit={handleSearch} className="flex gap-2 items-center">
                <AuthInput
                  type="text"
                  name="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products by name..."
                  width="w-full md:w-64"
                  Textcolor="text-gray-700"
                  borderColor="border-gray-300"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    dispatch(fetchProducts({ page: 1, limit: 10 }));
                  }}
                  className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                >
                  Clear
                </button>
              </form>
            </div>
          </div>

          {/* Products */}
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                {products.map((product) => (
                  <div key={product._id} className="w-full max-w-[280px]">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => fetchFilteredProducts(currentPage - 1)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-1 transition-all ${currentPage <= 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => fetchFilteredProducts(currentPage + 1)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-1 transition-all ${currentPage >= totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-700">No products found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters to find what you're looking for</p>
              <button
                onClick={() => {
                  setCategory([]);
                  setBrands([]);
                  setSortType('');
                  setAlphabeticOrder('');
                }}
                className="mt-4 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-500 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;