import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthInput from '../../components/common/AuthInput';
import SelectInput from '../../components/common/SelectInput';
import { toast } from 'react-toastify';
import {
  addProduct,
  getBrandAndCollection,
  resetProductState,
} from '../../features/products/productSlice';
import CropModal from '../../components/common/CropModel';
import { useNavigate } from 'react-router-dom';

function AddItem() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getBrandAndCollection());
  }, []);

  const { brands, categories } = useSelector((state) => state.products);
  const { currency } = useSelector((state) => state.global);
  // files waiting to crop
  const [pendingFiles, setPendingFiles] = useState([]);
  const [currentFileURL, setCurrentFileURL] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'productName':
        if (!value.trim()) {
          error = 'Product name is required';
        } else if (value.trim().length < 3) {
          error = 'Product name must be at least 3 characters';
        } else if (!/^[A-Za-z0-9 ]+$/.test(value)) {
          error = 'Product name can only contain letters, numbers, and spaces';
        }
        break;

      case 'description':
        if (!value.trim()) {
          error = 'Description is required';
        } else if (value.trim().length < 10) {
          error = 'Description must be at least 10 characters';
        }
        break;

      case 'category':
        if (!value) {
          error = 'Category is required';
        }
        break;

      case 'brand':
        if (!value) {
          error = 'Brand is required';
        }
        break;

      case 'tags':
        if (!value.trim()) {
          error = 'Tags are required';
        } else {
          const tagList = value
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean);
          if (tagList.length === 0) {
            error = 'Please enter at least one valid tag';
          }
        }
        break;

      case 'price':
        if (!value) {
          error = 'Price is required';
        } else {
          const numericPrice = Number(value);
          if (isNaN(numericPrice) || numericPrice <= 0) {
            error = 'Price must be a valid number greater than 0';
          }
        }
        break;

      case 'quantity':
        if (!value && value !== 0) {
          error = 'Quantity is required';
        } else {
          const numericQuantity = Number(value);
          if (isNaN(numericQuantity) || numericQuantity < 0) {
            error = 'Quantity must be a valid number greater than or equal to 0';
          } else if (!Number.isInteger(numericQuantity)) {
            error = 'Quantity must be a whole number';
          }
        }
        break;

      default:
        break;
    }

    return error;
  };

  const validateImages = () => {
    if (images.length === 0) {
      return 'At least 3 image is required';
    }
    if (images.length < 3) {
      return 'Minimum 3 images required';
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    for (const img of images) {
      if (!allowedTypes.includes(img.file.type)) {
        return `Invalid image type: ${img.file.name}. Only JPG, PNG, and WebP are allowed.`;
      }
      if (img.file.size > 5 * 1024 * 1024) {
        return `Image ${img.file.name} exceeds 5MB size limit.`;
      }
    }
    return '';
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate each field
    const nameError = validateField('productName', productName);
    if (nameError) newErrors.productName = nameError;

    const descError = validateField('description', description);
    if (descError) newErrors.description = descError;

    const categoryError = validateField('category', category);
    if (categoryError) newErrors.category = categoryError;

    const brandError = validateField('brand', brand);
    if (brandError) newErrors.brand = brandError;

    const tagsError = validateField('tags', tags);
    if (tagsError) newErrors.tags = tagsError;

    const priceError = validateField('price', price);
    if (priceError) newErrors.price = priceError;

    const quantityError = validateField('quantity', quantity);
    if (quantityError) newErrors.quantity = quantityError;

    // Validate images
    const imageError = validateImages();
    if (imageError) newErrors.images = imageError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //handiling the images upload
  const handleImageUpload = (e) => {
    const validImageTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/jpg',
    ];
    const files = Array.from(e.target.files);
    const total = images.length + files.length;
    
    // Clear previous image error
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: '' }));
    }

    for (let file of files) {
      if (!validImageTypes.includes(file.type)) {
        setErrors((prev) => ({ 
          ...prev, 
          images: 'The file needs to be an image format (JPG, PNG, WebP)' 
        }));
        return;
      }
    }
    
    if (total > 4) {
      setErrors((prev) => ({ 
        ...prev, 
        images: 'You can only upload 4 images max.' 
      }));
      return;
    }

    setPendingFiles(files);
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setCurrentFileURL(url);
      setShowCropper(true);
    }
  };

  // remove images if not needed
  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    // Clear image error when user removes images
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: '' }));
    }
  };

  //handling the crop before uploading image
  const handleCropDone = (cropped) => {
    setImages((prev) => [...prev, cropped]);
    const [, ...rest] = pendingFiles;
    setPendingFiles(rest);
    if (rest.length > 0) {
      const next = URL.createObjectURL(rest[0]);
      setCurrentFileURL(next);
    } else {
      setShowCropper(false);
      setCurrentFileURL(null);
    }
    
    // Clear image error when images are added
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: '' }));
    }
  };

  // crop cancel option
  const handleCropCancel = () => {
    const [, ...rest] = pendingFiles;
    setPendingFiles(rest);
    if (rest.length > 0) {
      const next = URL.createObjectURL(rest[0]);
      setCurrentFileURL(next);
    } else {
      setShowCropper(false);
      setCurrentFileURL(null);
    }
  };

  const handleInputChange = (setter, fieldName) => (e) => {
    const value = e.target.value;
    setter(value);
    
    // Clear error for this field when user starts typing
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: '' }));
    }
    
    // Optional: Real-time validation
    const fieldError = validateField(fieldName, value);
    if (fieldError) {
      setErrors((prev) => ({ ...prev, [fieldName]: fieldError }));
    }
  };

  // handling submit of form
  const handleSubmit = async () => {
    // Validate all fields before submission
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const trimmedName = productName.trim();
    const trimmedDescription = description.trim();
    const trimmedCategory = category.trim();
    const trimmedTags = tags.trim();
    const trimmedBrand = brand.trim();
    const numericPrice = Number(price);
    const numericQuantity = Number(quantity);

    const tagList = trimmedTags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    const formData = new FormData();
    formData.append('name', trimmedName);
    formData.append('description', trimmedDescription);
    formData.append('category', trimmedCategory);
    formData.append('tags', tagList.join(','));
    formData.append('brand', trimmedBrand);
    formData.append('price', numericPrice);
    formData.append('quantity', numericQuantity);
    images.forEach((img) => formData.append('images', img.file));

    setIsSubmitting(true);
    try {
      const res = await dispatch(addProduct(formData));
      if (res.type.endsWith('fulfilled')) {
        toast.success('✅ Product added successfully!');
        navigate('/admin/products');
        setProductName('');
        setDescription('');
        setCategory('');
        setTags('');
        setBrand('');
        setPrice('');
        setQuantity('');
        setImages([]);
        setErrors({});
        dispatch(resetProductState());
      } else {
        if (res.payload?.errors && Array.isArray(res.payload.errors)) {
          toast.error(res.payload.errors[0]);
        } else {
          toast.error(res.payload?.message || 'Failed to create product');
        }
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to add product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  //getting category and brands from database
  const categoryOptions = categories.map((category) => ({
    label: category.categoryName,
    value: category._id,
  }));

  const brandOptions = brands.map((brand) => ({
    label: brand.name,
    value: brand._id,
  }));

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl rounded-2xl border border-gray-200">
      <h1 className="text-3xl font-bold mb-8 text-center text-black">
        Add New Product
      </h1>

      {/* Image Upload */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Images (Max 4) <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
            errors.images ? 'border-red-500' : ''
          }`}
        />
        {errors.images && (
          <p className="mt-1 text-sm text-red-600 flex items-start">
            <svg 
              className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
            {errors.images}
          </p>
        )}
        <div className="mt-4 grid grid-cols-4 gap-4">
          {images.map((img, index) => (
            <div key={index} className="relative group">
              <img
                src={img.preview}
                alt={`Preview ${index}`}
                className="w-full h-24 object-cover rounded-md"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs hidden group-hover:block"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <AuthInput
        label="Product Name"
        type="text"
        name="productName"
        value={productName}
        onChange={handleInputChange(setProductName, 'productName')}
        placeholder="Enter product name"
        width="w-full"
        Textcolor="text-gray-700"
        borderColor={errors.productName ? "border-red-500" : "border-gray-300"}
        error={errors.productName}
        required={true}
      />

      {/* Description */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={description}
          onChange={handleInputChange(setDescription, 'description')}
          className={`block w-full px-4 py-3 rounded-lg border ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
          rows="4"
          placeholder="Enter detailed product description..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 flex items-start">
            <svg 
              className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
            {errors.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div>
          <SelectInput
            label="Category"
            value={category}
            onChange={(value) => {
              setCategory(value);
              if (errors.category) {
                setErrors((prev) => ({ ...prev, category: '' }));
              }
            }}
            options={categoryOptions}
            name="category"
            error={errors.category}
          />
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>
        <div>
          <SelectInput
            label="Brand"
            value={brand}
            onChange={(value) => {
              setBrand(value);
              if (errors.brand) {
                setErrors((prev) => ({ ...prev, brand: '' }));
              }
            }}
            options={brandOptions}
            name="brand"
            error={errors.brand}
          />
          {errors.brand && (
            <p className="mt-1 text-sm text-red-600">{errors.brand}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <AuthInput
          label="Tags"
          type="text"
          name="tags"
          value={tags}
          onChange={handleInputChange(setTags, 'tags')}
          placeholder="e.g., new, sale, trendy"
          width="w-full"
          Textcolor="text-gray-700"
          borderColor={errors.tags ? "border-red-500" : "border-gray-300"}
          error={errors.tags}
          required={true}
        />
        <AuthInput
          label="Price"
          type="number"
          name="price"
          value={price}
          onChange={handleInputChange(setPrice, 'price')}
          placeholder="Enter the amount"
          width="w-full"
          Textcolor="text-gray-700"
          borderColor={errors.price ? "border-red-500" : "border-gray-300"}
          error={errors.price}
          icon={currency}
          required={true}
        />

        <AuthInput
          label="Quantity"
          type="number"
          name="quantity"
          value={quantity}
          onChange={handleInputChange(setQuantity, 'quantity')}
          placeholder="Enter the Quantity"
          width="w-full"
          Textcolor="text-gray-700"
          borderColor={errors.quantity ? "border-red-500" : "border-gray-300"}
          error={errors.quantity}
          required={true}
        />
      </div>

      {/* Submit Button */}
      <div className="text-center mt-8">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`py-3 px-8 rounded-full text-white font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            'Add Product'
          )}
        </button>
      </div>
      
      {showCropper && currentFileURL && (
        <CropModal
          imageSrc={currentFileURL}
          onComplete={handleCropDone}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
}

export default AddItem;