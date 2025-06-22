import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWishlist, removeFromWishlist } from '../../features/wishlist/wishlistSlice';
import { toast } from 'react-toastify';

const Wishlist = () => {
    const dispatch = useDispatch();
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    
    // Get wishlist from Redux store
    const { wishlist } = useSelector(state => state.wishlist);
    
    const [selectedAction, setSelectedAction] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch wishlist on component mount and when isDeleting changes
    useEffect(() => {
        if (user) {
            dispatch(getWishlist(user._id));
        }
    }, [user, dispatch, isDeleting]);

    const handleActionChange = (e) => {
        setSelectedAction(e.target.value);
    };

    const handleApplyAction = () => {
        if (!selectedAction) return;

        setIsProcessing(true);

        setTimeout(() => {
            if (selectedAction === 'addToCart') {
                console.log('Adding to cart');
                // Show success notification
            } else if (selectedAction === 'removeFromWishlist') {
                // Implement bulk removal logic here if needed
            }
            setSelectedAction('');
            setIsProcessing(false);
        }, 800);
    };

    const handleRemoveItem = async (id) => {
        try {
            setIsDeleting(true);
            await dispatch(removeFromWishlist({ userId: user._id, productId: id })).unwrap();
            toast.success('Removed from wishlist');
        } catch (error) {
            toast.error('Failed to remove item');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleAddAllToCart = () => {
        setIsProcessing(true);
        setTimeout(() => {
            console.log('Adding all to cart');
            setIsProcessing(false);
        }, 1000);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Your Wishlist</h2>
                <span className="text-gray-600">{wishlist?.length || 0} {wishlist?.length === 1 ? 'item' : 'items'}</span>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Select
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {wishlist?.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            id={`item-${item._id}`}
                                            type="checkbox"
                                            className="rounded text-green-600 focus:ring-green-500"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-16 w-16">
                                                <img className="h-full w-full rounded-md object-cover" src={item.images[0]} alt={item.name} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                        ${item.price}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.stockStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {item.stockStatus ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleRemoveItem(item._id)}
                                            disabled={isDeleting}
                                            className={`text-red-600 hover:text-red-900 transition-colors duration-200 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {isDeleting ? (
                                                <svg className="animate-spin h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {wishlist?.length === 0 && (
                    <div className="text-center py-12">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">Your wishlist is empty</h3>
                        <p className="mt-1 text-gray-500">Start adding items you love!</p>
                    </div>
                )}

                <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                        <select
                            value={selectedAction}
                            onChange={handleActionChange}
                            className="block w-full sm:w-48 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                        >
                            <option value="">Choose action</option>
                            <option value="addToCart">Add to cart</option>
                            <option value="removeFromWishlist">Remove selected</option>
                        </select>
                        <button
                            onClick={handleApplyAction}
                            disabled={!selectedAction || isProcessing}
                            className={`px-4 py-2 rounded-md text-sm font-medium text-white ${!selectedAction || isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} transition-colors duration-200 flex items-center`}
                        >
                            {isProcessing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                'Apply Action'
                            )}
                        </button>
                    </div>
                    <button
                        onClick={handleAddAllToCart}
                        disabled={wishlist?.length === 0 || isProcessing}
                        className={`px-6 py-2 rounded-md text-sm font-medium text-white ${wishlist?.length === 0 || isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition-colors duration-200 w-full sm:w-auto flex items-center justify-center`}
                    >
                        {isProcessing ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            'Add All to Cart'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Wishlist;