import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createCoupons,
  deleteCoupon,
  fetchCoupons,
  updateCoupon,
} from '../../features/coupons/couponsSlice';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import AuthInput from '../../components/common/AuthInput';

const Coupons = () => {
  const dispatch = useDispatch();

  // Form visibility state
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [couponCode, setCouponCode] = useState('');
  const [discountType, setDiscountType] = useState('fixed');
  const [discountAmount, setDiscountAmount] = useState('');
  const [minPurchase, setMinPurchase] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [originalCoupon, setOriginalCoupon] = useState(null);

  // Validation errors state
  const [errors, setErrors] = useState({});

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  useEffect(() => {
    dispatch(fetchCoupons({ page: 1, limit: 4 }));
  }, []);

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Coupon code validation
    if (!couponCode.trim()) {
      newErrors.couponCode = 'Coupon code is required';
    }

    // Discount type validation
    if (!['fixed', 'percentage'].includes(discountType)) {
      newErrors.discountType = "Discount type must be 'fixed' or 'percentage'";
    }

    // Discount amount validation
    if (!discountAmount) {
      newErrors.discountAmount = 'Discount amount is required';
    } else if (isNaN(discountAmount) || Number(discountAmount) <= 0) {
      newErrors.discountAmount = 'Discount amount must be a positive number';
    } else if (
      discountType === 'percentage' &&
      (Number(discountAmount) > 100 || Number(discountAmount) < 1)
    ) {
      newErrors.discountAmount =
        'Percentage discount must be between 1 and 100';
    }

    // Minimum purchase validation
    if (!minPurchase) {
      newErrors.minPurchase = 'Minimum purchase amount is required';
    } else if (isNaN(minPurchase) || Number(minPurchase) <= 0) {
      newErrors.minPurchase =
        'Minimum purchase amount must be a positive number';
    }

    // Discount vs min purchase validation
    if (
      discountType === 'fixed' &&
      discountAmount &&
      minPurchase &&
      Number(discountAmount) >= Number(minPurchase)
    ) {
      newErrors.discountAmount =
        'Discount amount should be less than minimum purchase amount';
    }

    // Maximum discount validation for percentage
    if (discountType === 'percentage') {
      if (!maxDiscount) {
        newErrors.maxDiscount =
          'Maximum discount is required for percentage coupons';
      } else if (isNaN(maxDiscount) || Number(maxDiscount) <= 0) {
        newErrors.maxDiscount = 'Maximum discount must be a positive number';
      } else if (
        maxDiscount &&
        minPurchase &&
        Number(maxDiscount) > Number(minPurchase)
      ) {
        newErrors.maxDiscount =
          'Maximum discount cannot exceed minimum purchase amount';
      }
    }

    // Usage limit validation
    if (!usageLimit) {
      newErrors.usageLimit = 'Usage limit is required';
    } else if (isNaN(usageLimit) || Number(usageLimit) <= 0) {
      newErrors.usageLimit = 'Usage limit must be a positive number';
    }

    // Expiration date validation
    if (!expirationDate) {
      newErrors.expirationDate = 'Expiration date is required';
    } else if (isNaN(new Date(expirationDate).getTime())) {
      newErrors.expirationDate = 'Invalid expiration date';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expiry = new Date(expirationDate);
      if (expiry <= today) {
        newErrors.expirationDate = 'Expiration date must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const data = {
      couponCode: couponCode.trim(),
      discountType,
      discountAmount: Number(discountAmount),
      minPurchase: Number(minPurchase),
      maxDiscount: Number(maxDiscount) || 0,
      usageLimit: Number(usageLimit),
      expirationDate,
    };

    const res = await dispatch(createCoupons(data));

    if (res.type === 'admin/createCoupons/fulfilled') {
      toast.success(res?.payload?.message);

      // Reset form and close it
      setCouponCode('');
      setDiscountType('fixed');
      setDiscountAmount('');
      setMinPurchase('');
      setMaxDiscount('');
      setUsageLimit('');
      setExpirationDate('');
      setErrors({});
      setIsFormOpen(false); // Hide form after successful submission

      // Refresh coupons list
      dispatch(fetchCoupons({ page: 1, limit: 4, search: searchTerm }));
    } else {
      if (res.payload?.errors && Array.isArray(res.payload.errors)) {
        toast.error(res.payload.errors[0]);
      } else {
        toast.error(res.payload?.message || 'Failed to create coupon');
      }
    }
  };

  const { loading, coupons, page, totalPages } = useSelector(
    (state) => state.coupons
  );

  const handleDiscountTypeChange = (e) => {
    setDiscountType(e.target.value);
    // Clear relevant errors when switching discount type
    if (e.target.value === 'fixed') {
      setErrors((prev) => ({ ...prev, maxDiscount: undefined }));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchCoupons({ page: 1, limit: 4, search: searchTerm }));
  };

  const handleDeleteCoupon = (couponId) => {
    return async () => {
      const res = await dispatch(deleteCoupon(couponId));
      if (res.type === 'admin/deleteCoupon/fulfilled') {
        toast.success('Coupon deleted successfully');
        dispatch(fetchCoupons({ page: page, limit: 4, search: searchTerm }));
      } else {
        toast.error(res.payload.message);
      }
    };
  };

  // Open edit modal with coupon data
  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setOriginalCoupon({ ...coupon });
    setIsEditModalOpen(true);
  };

  // Edit form validation
  const validateEditForm = () => {
    const newErrors = {};

    if (!editingCoupon.code?.trim()) {
      newErrors.code = 'Coupon code is required';
    }

    if (!editingCoupon.discountValue) {
      newErrors.discountValue = 'Discount amount is required';
    } else if (
      isNaN(editingCoupon.discountValue) ||
      Number(editingCoupon.discountValue) <= 0
    ) {
      newErrors.discountValue = 'Discount amount must be a positive number';
    } else if (
      editingCoupon.discountType === 'percentage' &&
      (Number(editingCoupon.discountValue) > 100 ||
        Number(editingCoupon.discountValue) < 1)
    ) {
      newErrors.discountValue = 'Percentage discount must be between 1 and 100';
    }

    if (!editingCoupon.minOrderAmount) {
      newErrors.minOrderAmount = 'Minimum purchase amount is required';
    } else if (
      isNaN(editingCoupon.minOrderAmount) ||
      Number(editingCoupon.minOrderAmount) <= 0
    ) {
      newErrors.minOrderAmount =
        'Minimum purchase amount must be a positive number';
    }

    if (editingCoupon.discountType === 'percentage') {
      if (!editingCoupon.maxDiscount) {
        newErrors.maxDiscount = 'Maximum discount is required';
      } else if (
        isNaN(editingCoupon.maxDiscount) ||
        Number(editingCoupon.maxDiscount) <= 0
      ) {
        newErrors.maxDiscount = 'Maximum discount must be a positive number';
      }
    }

    if (!editingCoupon.usageLimit) {
      newErrors.usageLimit = 'Usage limit is required';
    } else if (
      isNaN(editingCoupon.usageLimit) ||
      Number(editingCoupon.usageLimit) <= 0
    ) {
      newErrors.usageLimit = 'Usage limit must be a positive number';
    }

    if (!editingCoupon.expiresAt) {
      newErrors.expiresAt = 'Expiration date is required';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expiry = new Date(editingCoupon.expiresAt);
      if (expiry <= today) {
        newErrors.expiresAt = 'Expiration date must be in the future';
      }
    }

    return newErrors;
  };

  const handleUpdateCoupon = async (e) => {
    e.preventDefault();

    const editErrors = validateEditForm();
    if (Object.keys(editErrors).length > 0) {
      // You can set these errors in a state if you want to show them in the modal
      toast.error(Object.values(editErrors)[0]);
      return;
    }

    if (!editingCoupon || !originalCoupon) return;

    const hasChanges =
      editingCoupon.code !== originalCoupon.code ||
      editingCoupon.discountType !== originalCoupon.discountType ||
      editingCoupon.discountValue !== originalCoupon.discountValue ||
      editingCoupon.minOrderAmount !== originalCoupon.minOrderAmount ||
      editingCoupon.maxDiscount !== originalCoupon.maxDiscount ||
      editingCoupon.usageLimit !== originalCoupon.usageLimit ||
      editingCoupon.expiresAt.split('T')[0] !==
        originalCoupon.expiresAt.split('T')[0];

    if (!hasChanges) {
      toast.info('No changes detected');
      return;
    }

    const data = {
      couponId: editingCoupon._id,
      couponCode: editingCoupon.code,
      discountType: editingCoupon.discountType,
      discountAmount: editingCoupon.discountValue,
      minPurchase: editingCoupon.minOrderAmount,
      maxDiscount: editingCoupon.maxDiscount || 0,
      usageLimit: editingCoupon.usageLimit,
      expirationDate: editingCoupon.expiresAt,
    };

    const res = await dispatch(updateCoupon(data));
    if (res.type === 'admin/updateCoupon/fulfilled') {
      toast.success(res?.payload?.message);
      setIsEditModalOpen(false);
      dispatch(fetchCoupons({ page: page, limit: 4, search: searchTerm }));
    } else {
      toast.error(res.payload.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section with Toggle Button */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Coupon Management</h2>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <span>{isFormOpen ? 'Hide Form' : 'Add New Coupon'}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transform transition-transform ${isFormOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Collapsible Coupon Form */}
      {isFormOpen && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-slideDown">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Create New Coupon
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coupon Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coupon Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    setErrors((prev) => ({ ...prev, couponCode: undefined }));
                  }}
                  placeholder="e.g., SUMMER25"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.couponCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.couponCode && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.couponCode}
                  </p>
                )}
              </div>

              {/* Discount Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={discountType}
                  onChange={handleDiscountTypeChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="fixed">Fixed Amount</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>

              {/* Discount Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {discountType === 'fixed'
                    ? 'Discount Amount (₹)'
                    : 'Discount Percentage (%)'}{' '}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {discountType === 'fixed' ? '₹' : '%'}
                  </span>
                  <input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => {
                      setDiscountAmount(e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        discountAmount: undefined,
                      }));
                    }}
                    step={discountType === 'fixed' ? '0.01' : '1'}
                    min="0"
                    max={discountType === 'percentage' ? '100' : ''}
                    className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.discountAmount
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.discountAmount && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.discountAmount}
                  </p>
                )}
              </div>

              {/* Minimum Purchase */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Purchase (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={minPurchase}
                    onChange={(e) => {
                      setMinPurchase(e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        minPurchase: undefined,
                      }));
                    }}
                    step="0.01"
                    min="0"
                    className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.minPurchase ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.minPurchase && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.minPurchase}
                  </p>
                )}
              </div>

              {/* Maximum Discount (only for percentage) */}
              {discountType === 'percentage' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Discount (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={maxDiscount}
                      onChange={(e) => {
                        setMaxDiscount(e.target.value);
                        setErrors((prev) => ({
                          ...prev,
                          maxDiscount: undefined,
                        }));
                      }}
                      step="0.01"
                      min="0"
                      className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.maxDiscount
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.maxDiscount && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.maxDiscount}
                    </p>
                  )}
                </div>
              )}

              {/* Usage Limit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usage Limit <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={usageLimit}
                  onChange={(e) => {
                    setUsageLimit(e.target.value);
                    setErrors((prev) => ({ ...prev, usageLimit: undefined }));
                  }}
                  min="1"
                  placeholder="eg. 100"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.usageLimit ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.usageLimit && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.usageLimit}
                  </p>
                )}
              </div>

              {/* Expiration Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiration Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => {
                    setExpirationDate(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      expirationDate: undefined,
                    }));
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.expirationDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.expirationDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.expirationDate}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              {loading ? 'Creating...' : 'Create Coupon'}
            </button>
          </form>
        </div>
      )}

      {/* Active Coupons Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">
            Active Coupons
          </h3>

          {/* Search Bar */}
          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <AuthInput
                type="text"
                name="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search coupons by code..."
                width="w-full md:w-96"
                Textcolor="text-gray-700"
                borderColor="border-gray-300"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Search
              </button>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    dispatch(fetchCoupons({ page: 1, limit: 4 }));
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Clear
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Coupons Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  CODE
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  DISCOUNT
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  MAX DISCOUNT
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  USAGE
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  EXPIRES
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coupons.length > 0 ? (
                coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {coupon.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {coupon.discountType === 'fixed'
                        ? `₹ ${coupon.discountValue}.00 off`
                        : `${coupon.discountValue} % `}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {coupon.discountType === 'percentage'
                        ? `₹ ${coupon.maxDiscount}`
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${coupon.usersUsed?.length || 0}/${coupon.usageLimit}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(coupon.expiresAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEditCoupon(coupon)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDeleteCoupon(coupon._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No coupons found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={page <= 1}
              onClick={() =>
                dispatch(
                  fetchCoupons({
                    page: page - 1,
                    limit: 4,
                    search: searchTerm,
                  })
                )
              }
              className={`px-4 py-2 rounded ${
                page <= 1
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Previous
            </button>

            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() =>
                dispatch(
                  fetchCoupons({
                    page: page + 1,
                    limit: 4,
                    search: searchTerm,
                  })
                )
              }
              className={`px-4 py-2 rounded ${
                page >= totalPages
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Edit Coupon Modal */}
      {isEditModalOpen && editingCoupon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Edit Coupon
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateCoupon}>
              <div className="space-y-4">
                {/* Coupon Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coupon Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingCoupon.code}
                    onChange={(e) =>
                      setEditingCoupon({
                        ...editingCoupon,
                        code: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Discount Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editingCoupon.discountType}
                    onChange={(e) =>
                      setEditingCoupon({
                        ...editingCoupon,
                        discountType: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="fixed">Fixed Amount</option>
                    <option value="percentage">Percentage</option>
                  </select>
                </div>

                {/* Discount Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {editingCoupon.discountType === 'fixed'
                      ? 'Discount Amount (₹)'
                      : 'Discount Percentage (%)'}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {editingCoupon.discountType === 'fixed' ? '₹' : '%'}
                    </span>
                    <input
                      type="number"
                      value={editingCoupon.discountValue}
                      onChange={(e) =>
                        setEditingCoupon({
                          ...editingCoupon,
                          discountValue: e.target.value,
                        })
                      }
                      step={
                        editingCoupon.discountType === 'fixed' ? '0.01' : '1'
                      }
                      min="0"
                      max={
                        editingCoupon.discountType === 'percentage' ? '100' : ''
                      }
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Minimum Purchase */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Purchase (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={editingCoupon.minOrderAmount}
                      onChange={(e) =>
                        setEditingCoupon({
                          ...editingCoupon,
                          minOrderAmount: e.target.value,
                        })
                      }
                      step="0.01"
                      min="0"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Maximum Discount (only for percentage) */}
                {editingCoupon.discountType === 'percentage' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Discount (₹){' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={editingCoupon.maxDiscount}
                        onChange={(e) =>
                          setEditingCoupon({
                            ...editingCoupon,
                            maxDiscount: e.target.value,
                          })
                        }
                        step="0.01"
                        min="0"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                {/* Usage Limit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usage Limit <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={editingCoupon.usageLimit}
                    onChange={(e) =>
                      setEditingCoupon({
                        ...editingCoupon,
                        usageLimit: e.target.value,
                      })
                    }
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Expiration Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiration Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={editingCoupon.expiresAt.split('T')[0]}
                    onChange={(e) =>
                      setEditingCoupon({
                        ...editingCoupon,
                        expiresAt: e.target.value,
                      })
                    }
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {loading ? 'Updating...' : 'Update Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;
