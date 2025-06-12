import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthInput from '../../components/common/AuthInput';
import SelectInput from '../../components/common/SelectInput';
import { toast } from 'react-toastify';
import { addProduct, resetProductState } from '../../features/products/productSlice';
import CropModal from '../../components/common/CropModel';

function AddItem() {
  const dispatch = useDispatch();
  const [images, setImages] = useState([]); // Array of { file, preview }
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [quantity,setQuantity]=useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [pendingFiles, setPendingFiles] = useState([]); // files waiting to crop
  const [currentFileURL, setCurrentFileURL] = useState(null);
  const [showCropper, setShowCropper] = useState(false);


  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const total = images.length + files.length;
    if (total > 4) {
      toast.error("You can only upload 4 images max.");
      return;
    }

    setPendingFiles(files);
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setCurrentFileURL(url);
      setShowCropper(true);
    }
  };


  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleCropDone = (cropped) => {
    setImages(prev => [...prev, cropped]);
    const [, ...rest] = pendingFiles;
    setPendingFiles(rest)
    if (rest.length > 0) {
      const next = URL.createObjectURL(rest[0]);
      setCurrentFileURL(next)
    } else {
      setShowCropper(false);
      setSelectedFile(null);
    }
  };

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



  const handleSubmit = async () => {
    if (!productName || !description || !category || !tags || !brand || !price || images.length === 0) {
      toast.error('Please fill all fields and upload at least one image.');
      return;
    }

      if (isNaN(price)) {
    toast.error('Price must be a valid number.');
    return;
  }

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('tags', tags);
    formData.append('brand', brand);
    formData.append('price', price);
    images.forEach(img => formData.append('images', img.file));

    setIsSubmitting(true);
    try {
      await dispatch(addProduct(formData)).unwrap();
      toast.success('✅ Product added successfully!');
      setProductName('');
      setDescription('');
      setCategory('');
      setTags('');
      setBrand('');
      setPrice('');
      setImages([]);
      dispatch(resetProductState());
    } catch (error) {
      toast.error(error?.message || 'Failed to add product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = [
    { label: "Men", value: "men" },
    { label: "Women", value: "women" },
    { label: "Couples", value: "couples" },
  ];

  const brandOptions = [
    { label: "Rolex", value: "rolex" },
    { label: "Omega", value: "omega" },
    { label: "Casio", value: "casio" },
  ];

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl rounded-2xl border border-gray-200">
      <h1 className="text-3xl font-bold mb-8 text-center text-black">
        Add New Product
      </h1>

      {/* Image Upload */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images (Max 4)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
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
        name="name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        placeholder="Enter product name"
        width="w-full"
        Textcolor="text-gray-700"
        borderColor="border-gray-300"
      />

      {/* Description */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          rows="4"
          placeholder="Enter detailed product description..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <SelectInput
          label="Category"
          value={category}
          onChange={setCategory}
          options={categoryOptions}
          name="category"
        />
        <SelectInput
          label="Brand"
          value={brand}
          onChange={setBrand}
          options={brandOptions}
          name="brand"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <AuthInput
          label="Tags"
          type="text"
          name="tag"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., new, sale, trendy"
          width="w-full"
          Textcolor="text-gray-700"
          borderColor="border-gray-300"
        />
        <AuthInput
          label="Price"
          type="text"
          name="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter the amount"
          width="w-full"
          Textcolor="text-gray-700"
          borderColor="border-gray-300"
          icon="$"
        />
      </div>

      {/* Submit Button */}
      <div className="text-center mt-8">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`py-3 px-8 rounded-full text-white font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
