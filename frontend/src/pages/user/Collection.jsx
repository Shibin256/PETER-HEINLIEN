import React, { useEffect, useState } from 'react';
import Title from '../../components/common/Title';
import ProductCard from '../../components/common/ProductCard';
import { fetchProducts, getBrandAndCollection } from '../../features/products/productSlice';
import { useDispatch, useSelector } from 'react-redux';

const Collection = () => {

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([])
  const [category, setCategory] = useState([]);
  const [brand, setBrands] = useState([]);
  const [sortType, setSortType] = useState('relavent')
  const [alphabeticOrder, setAlphabeticOrder] = useState('normal')

  const dispatch = useDispatch()
  //fetching products and brands
  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(getBrandAndCollection())
  }, [])

  const { products, brands, categories } = useSelector(state => state.products)

  //category filter assign
  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  //brnad filter assign
  const toggleBrand = (e) => {
    if (brand.includes(e.target.value)) {
      setBrands(prev => prev.filter(item => item !== e.target.value))
    } else {
      setBrands(prev => [...prev, e.target.value])
    }
  }

  //handling apply filter
  const applyFilter = () => {
    let productCopy = products.slice();
    if (category.length > 0) {
      productCopy = productCopy.filter(item => category.includes(item.category.categoryName))
    }
    if (brand.length > 0) {
      productCopy = productCopy.filter(item => brand.includes(item.brand.name))
    }

    setFilterProducts(productCopy)
  }

  //sorting product based on price handling
  const sortProducts = () => {
    let fpCopy = filterProducts.slice();
    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price))
        break;

      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price))
        break;

      default:
        applyFilter()
        break
    }
  }

//sorting based on alphabetic order handling
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
        applyFilter(); // fallback
        break;
    }
  };

  useEffect(() => {
    setFilterProducts(products)
  }, [products])


  useEffect(() => {
    applyFilter();
  }, [brand, category])


  useEffect(() => {
    sortProducts();
  }, [sortType])

  useEffect(() => {
    SortByAlphabeticOrder();
  }, [alphabeticOrder])


  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter Options */}
      <div className="min-w-60">
        <div
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
          onClick={() => setShowFilter(!showFilter)}
        >
          <span>FILTERS</span>
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${showFilter ? 'rotate-90' : ''} sm:hidden`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {categories.map((category, index) => (
              <p className="flex gap-2" key={category._id || index}>
                <input className="w-3" type="checkbox" value={category.categoryName} onChange={toggleCategory} /> {category.categoryName}
              </p>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="mb-3 text-sm font-medium">Brand</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {brands.map((brand, index) => (
              <p className="flex gap-2" key={brand._id || index}>
                <input className="w-3" type="checkbox" onChange={toggleBrand} value={brand.name} /> {brand.name}
              </p>
            ))}

          </div>
        </div>

        {/* Alphabetic Sort */}
        <br />
        <select onChange={(e) => setAlphabeticOrder(e.target.value)} className="border-2 border-gray-300 text-sm px-2 py-1 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="normal">Alphabetic order:</option>
          <option value="a-z">Alphabetic order: A - Z </option>
          <option value="z-a">Alphabetic order: Z - A </option>
        </select>

      </div>

      {/* Right Side */}
      <div className="flex-1">
        <div className="flex justify-between items-center text-base sm:text-2xl mb-4">
          <Title text1={'ALL'} text2={'COLLECTIONS'} />

          {/* Product Sort */}
          <select onChange={(e) => setSortType(e.target.value)} className="border-2 border-gray-300 text-sm px-2 py-1 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {
            filterProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))
          }
        </div>

      </div>
    </div>
  );
};

export default Collection;
