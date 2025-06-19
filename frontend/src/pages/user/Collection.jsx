import React, { useEffect, useState } from 'react';
import Title from '../../components/common/Title';
import ProductCard from '../../components/common/ProductCard';
import { fetchProducts, getBrandAndCollection } from '../../features/products/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from "react-infinite-scroll-component";

const Collection = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [brand, setBrands] = useState([]);
  const [sortType, setSortType] = useState('relavent');
  const [alphabeticOrder, setAlphabeticOrder] = useState('normal');

  const dispatch = useDispatch();

  // Fetching products and brands
  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 3 }));
    dispatch(getBrandAndCollection());
  }, [dispatch]);



  const { products, page,totalPages , brands, categories } = useSelector(state => state.products);


  // Category filter assign
  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value));
    } else {
      setCategory(prev => [...prev, e.target.value]);
    }
  };

  // Brand filter assign
  const toggleBrand = (e) => {
    if (brand.includes(e.target.value)) {
      setBrands(prev => prev.filter(item => item !== e.target.value));
    } else {
      setBrands(prev => [...prev, e.target.value]);
    }
  };

  // Handling apply filter
  const applyFilter = () => {
    let productCopy = products.slice();
    if (category.length > 0) {
      productCopy = productCopy.filter(item => category.includes(item.category.categoryName));
    }
    if (brand.length > 0) {
      productCopy = productCopy.filter(item => brand.includes(item.brand.name));
    }
    setFilterProducts(productCopy);
  };

  // Sorting product based on price handling
  const sortProducts = () => {
    let fpCopy = filterProducts.slice();
    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

  // Sorting based on alphabetic order handling
  const SortByAlphabeticOrder = () => {
    let fpCopy = filterProducts.slice();
    switch (alphabeticOrder) {
      case 'a-z':
        fpCopy.sort((a, b) => a.name.localeCompare(b.name));
        setFilterProducts(fpCopy);
        break;
      case 'z-a':
        fpCopy.sort((a, b) => b.name.localeCompare(a.name));
        setFilterProducts(fpCopy);
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    setFilterProducts(products);
  }, [products]);

  useEffect(() => {
    applyFilter();
  }, [brand, category]);

  useEffect(() => {
    sortProducts();
  }, [sortType]);

  useEffect(() => {
    SortByAlphabeticOrder();
  }, [alphabeticOrder]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Options - Left Side */}
        <div className="lg:w-72 xl:w-80">
          <div
            className="my-2 text-xl flex items-center cursor-pointer gap-2 lg:cursor-auto"
            onClick={() => setShowFilter(!showFilter)}
          >
            <span>FILTERS</span>
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${showFilter ? 'rotate-90' : ''} lg:hidden`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <div className={`${showFilter ? 'block' : 'hidden'} lg:block space-y-6`}>
            {/* Category Filter */}
            <div className="border border-gray-300 p-5 rounded">
              <p className="mb-3 text-sm font-medium uppercase">Categories</p>
              <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                {categories.map((category, index) => (
                  <label className="flex items-center gap-2" key={category._id || index}>
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      value={category.categoryName}
                      onChange={toggleCategory}
                    />
                    <span>{category.categoryName}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brands Filter */}
            <div className="border border-gray-300 p-5 rounded">
              <p className="mb-3 text-sm font-medium uppercase">Brands</p>
              <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                {brands.map((brand, index) => (
                  <label className="flex items-center gap-2" key={brand._id || index}>
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      onChange={toggleBrand}
                      value={brand.name}
                    />
                    <span>{brand.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Alphabetic Sort */}
            <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
              <select
                onChange={(e) => setAlphabeticOrder(e.target.value)}
                className="text-sm px-2 py-1 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="normal">Alphabetic order:</option>
                <option value="a-z">Alphabetic order: A - Z</option>
                <option value="z-a">Alphabetic order: Z - A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Listing - Right Side */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <Title text1={'ALL'} text2={'COLLECTIONS'} />

            {/* Product Sort */}
            <select
              onChange={(e) => setSortType(e.target.value)}
              className="w-full sm:w-auto border-2 border-gray-300 text-sm px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>

          {/* Product Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 justify-items-center'>
            {filterProducts.map((product, index) => (
              <div key={index} className="w-full max-w-[280px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Pagination Buttons */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={page <= 1}
              onClick={() => dispatch(fetchProducts({ page: page - 1, limit: 3 }))}
              className={`px-4 py-2 rounded ${page <= 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
            >
              Previous
            </button>

            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => dispatch(fetchProducts({ page: page + 1, limit: 3 }))}
              className={`px-4 py-2 rounded ${page >= totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
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