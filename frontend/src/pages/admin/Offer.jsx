import React, { useState } from 'react';

const Offers = () => {
    // Sample data
    const sampleProducts = [
        { _id: '1', name: 'T-Shirt' },
        { _id: '2', name: 'Jeans' },
        { _id: '3', name: 'Sneakers' },
        { _id: '4', name: 'Hat' },
    ];

    const sampleCategories = [
        { _id: '1', categoryName: 'Clothing' },
        { _id: '2', categoryName: 'Footwear' },
        { _id: '3', categoryName: 'Accessories' },
    ];

    const sampleOffers = [
        {
            _id: '1',
            title: 'Summer Sale',
            description: 'Discount on summer collection',
            discountType: 'percentage',
            discountValue: '20',
            offerType: 'product',
            products: [{ _id: '1', name: 'T-Shirt' }, { _id: '2', name: 'Jeans' }],
            category: null,
            startDate: '2023-06-01T00:00:00Z',
            endDate: '2023-06-30T00:00:00Z',
            isActive: true
        },
        {
            _id: '2',
            title: 'Winter Clearance',
            description: 'Clearance sale on winter items',
            discountType: 'fixed',
            discountValue: '500',
            offerType: 'category',
            products: [],
            category: { _id: '1', categoryName: 'Clothing' },
            startDate: '2023-12-01T00:00:00Z',
            endDate: '2023-12-31T00:00:00Z',
            isActive: false
        }
    ];

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [discountType, setDiscountType] = useState('percentage');
    const [discountValue, setDiscountValue] = useState('');
    const [offerType, setOfferType] = useState('product');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Edit modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingOffer, setEditingOffer] = useState(null);

    const toggleProductSelection = (productId) => {
        setSelectedProducts(prev => 
            prev.includes(productId) 
                ? prev.filter(id => id !== productId) 
                : [...prev, productId]
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Offer Management</h2>
            </div>

            {/* Offer Form */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Create New Offer</h3>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Summer Sale"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Discount Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type*</label>
                            <select
                                value={discountType}
                                onChange={(e) => setDiscountType(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed Amount</option>
                            </select>
                        </div>

                        {/* Discount Value */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {discountType === 'fixed' ? 'Discount Amount (₹)*' : 'Discount Percentage (%)*'}
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    {discountType === 'fixed' ? '₹' : '%'}
                                </span>
                                <input
                                    type="number"
                                    value={discountValue}
                                    onChange={(e) => setDiscountValue(e.target.value)}
                                    step={discountType === 'fixed' ? "0.01" : "1"}
                                    min="0"
                                    max={discountType === 'percentage' ? "100" : ""}
                                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Offer Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Offer Type*</label>
                            <select
                                value={offerType}
                                onChange={(e) => setOfferType(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="product">Product</option>
                                <option value="category">Category</option>
                            </select>
                        </div>

                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date*</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* End Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date*</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Optional offer description"
                        />
                    </div>

                    {/* Product/Category Selection */}
                    <div className="mt-4">
                        {offerType === 'product' ? (
                            <>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Products*</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded">
                                    {sampleProducts.map(product => (
                                        <div key={product._id} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`product-${product._id}`}
                                                checked={selectedProducts.includes(product._id)}
                                                onChange={() => toggleProductSelection(product._id)}
                                                className="mr-2"
                                            />
                                            <label htmlFor={`product-${product._id}`}>{product.name}</label>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Category*</label>
                                <select
                                    value={selectedCategory || ''}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select a category</option>
                                    {sampleCategories.map(category => (
                                        <option key={category._id} value={category._id}>
                                            {category.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}
                    </div>

                    {/* Active Status */}
                    <div className="mt-4 flex items-center">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                            Active Offer
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors"
                    >
                        Create Offer
                    </button>
                </form>
            </div>

            {/* Active Offers Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">Active Offers</h3>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
                            <input
                                type="text"
                                name="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search offers by title..."
                                className="w-full md:w-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                </div>

                {/* Offers Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TITLE</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DISCOUNT</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APPLIES TO</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PERIOD</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sampleOffers.map((offer) => (
                                <tr key={offer._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{offer.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{offer.offerType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {offer.discountType === 'fixed' ? `₹${offer.discountValue}` : `${offer.discountValue}%`}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {offer.offerType === 'product' 
                                            ? `${offer.products.length} product(s)` 
                                            : offer.category?.categoryName || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(offer.startDate)} - {formatDate(offer.endDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 py-1 rounded-full text-xs ${offer.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {offer.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button 
                                            onClick={() => {
                                                setEditingOffer(offer);
                                                setIsEditModalOpen(true);
                                            }}
                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => console.log('Delete offer', offer._id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="flex flex-col md:flex-row justify-between items-center mt-4 text-sm text-gray-600">
                    {/* Pagination Buttons */}
                    <div className="flex justify-center items-center gap-4 mt-6">
                        <button
                            disabled={true}
                            className="px-4 py-2 rounded bg-gray-300 cursor-not-allowed"
                        >
                            Previous
                        </button>

                        <span className="text-sm text-gray-700">
                            Page 1 of 1
                        </span>

                        <button
                            disabled={true}
                            className="px-4 py-2 rounded bg-gray-300 cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Offer Modal */}
            {isEditModalOpen && editingOffer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Edit Offer</h3>
                            <button 
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                                    <input
                                        type="text"
                                        value={editingOffer.title}
                                        onChange={(e) => setEditingOffer({
                                            ...editingOffer,
                                            title: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Discount Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type*</label>
                                    <select
                                        value={editingOffer.discountType}
                                        onChange={(e) => setEditingOffer({
                                            ...editingOffer,
                                            discountType: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="percentage">Percentage</option>
                                        <option value="fixed">Fixed Amount</option>
                                    </select>
                                </div>

                                {/* Discount Value */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {editingOffer.discountType === 'fixed' ? 'Discount Amount (₹)*' : 'Discount Percentage (%)*'}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            {editingOffer.discountType === 'fixed' ? '₹' : '%'}
                                        </span>
                                        <input
                                            type="number"
                                            value={editingOffer.discountValue}
                                            onChange={(e) => setEditingOffer({
                                                ...editingOffer,
                                                discountValue: e.target.value
                                            })}
                                            step={editingOffer.discountType === 'fixed' ? "0.01" : "1"}
                                            min="0"
                                            max={editingOffer.discountType === 'percentage' ? "100" : ""}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Offer Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Offer Type*</label>
                                    <select
                                        value={editingOffer.offerType}
                                        onChange={(e) => setEditingOffer({
                                            ...editingOffer,
                                            offerType: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="product">Product</option>
                                        <option value="category">Category</option>
                                    </select>
                                </div>

                                {/* Start Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date*</label>
                                    <input
                                        type="date"
                                        value={editingOffer.startDate.split('T')[0]}
                                        onChange={(e) => setEditingOffer({
                                            ...editingOffer,
                                            startDate: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* End Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date*</label>
                                    <input
                                        type="date"
                                        value={editingOffer.endDate.split('T')[0]}
                                        onChange={(e) => setEditingOffer({
                                            ...editingOffer,
                                            endDate: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={editingOffer.description}
                                    onChange={(e) => setEditingOffer({
                                        ...editingOffer,
                                        description: e.target.value
                                    })}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Product/Category Selection */}
                            <div className="mt-4">
                                {editingOffer.offerType === 'product' ? (
                                    <>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Products*</label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded">
                                            {sampleProducts.map(product => (
                                                <div key={product._id} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`edit-product-${product._id}`}
                                                        checked={editingOffer.products.some(p => p._id === product._id)}
                                                        onChange={() => {
                                                            const newProducts = editingOffer.products.some(p => p._id === product._id)
                                                                ? editingOffer.products.filter(p => p._id !== product._id)
                                                                : [...editingOffer.products, product];
                                                            setEditingOffer({
                                                                ...editingOffer,
                                                                products: newProducts
                                                            });
                                                        }}
                                                        className="mr-2"
                                                    />
                                                    <label htmlFor={`edit-product-${product._id}`}>{product.name}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Category*</label>
                                        <select
                                            value={editingOffer.category?._id || ''}
                                            onChange={(e) => {
                                                const selectedCat = sampleCategories.find(cat => cat._id === e.target.value);
                                                setEditingOffer({
                                                    ...editingOffer,
                                                    category: selectedCat || null
                                                });
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select a category</option>
                                            {sampleCategories.map(category => (
                                                <option key={category._id} value={category._id}>
                                                    {category.categoryName}
                                                </option>
                                            ))}
                                        </select>
                                    </>
                                )}
                            </div>

                            {/* Active Status */}
                            <div className="mt-4 flex items-center">
                                <input
                                    type="checkbox"
                                    id="edit-isActive"
                                    checked={editingOffer.isActive}
                                    onChange={(e) => setEditingOffer({
                                        ...editingOffer,
                                        isActive: e.target.checked
                                    })}
                                    className="mr-2"
                                />
                                <label htmlFor="edit-isActive" className="text-sm font-medium text-gray-700">
                                    Active Offer
                                </label>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        console.log('Updated offer:', editingOffer);
                                        setIsEditModalOpen(false);
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Update Offer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Offers;