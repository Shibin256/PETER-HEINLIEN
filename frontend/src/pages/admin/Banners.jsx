import React, { useState, useRef } from 'react';
import { FiPlus, FiTrash2, FiEye, FiCheckCircle, FiUpload, FiX } from 'react-icons/fi';

const Banners = () => {
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonLink, setButtonLink] = useState('');
  
  // Image states
  const [bgImage, setBgImage] = useState(null);
  const [bgImagePreview, setBgImagePreview] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState('');
  
  // Refs for file inputs
  const bgImageInputRef = useRef(null);
  const mainImageInputRef = useRef(null);

  // Banners list
  const [banners, setBanners] = useState([]);
  const [activeBannerId, setActiveBannerId] = useState(null);

  const handleBgImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBgImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBgImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBgImage = () => {
    setBgImage(null);
    setBgImagePreview('');
    if (bgImageInputRef.current) {
      bgImageInputRef.current.value = '';
    }
  };

  const removeMainImage = () => {
    setMainImage(null);
    setMainImagePreview('');
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = '';
    }
  };

  const handleCreate = () => {
    if (!bgImagePreview || !title) return;
    
    const newBanner = {
      id: Date.now(),
      bgImage: bgImagePreview,
      mainImage: mainImagePreview,
      title,
      description,
      buttonText,
      buttonLink,
      createdAt: new Date().toISOString()
    };

    setBanners([...banners, newBanner]);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setButtonText('');
    setButtonLink('');
    setBgImage(null);
    setBgImagePreview('');
    setMainImage(null);
    setMainImagePreview('');
  };

  const deleteBanner = (id) => {
    setBanners(banners.filter(banner => banner.id !== id));
    if (activeBannerId === id) {
      setActiveBannerId(null);
    }
  };

  const activateBanner = (id) => {
    setActiveBannerId(id);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Banner Management</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Banner Creation Form */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Create New Banner</h3>
          
          <div className="space-y-4">
            {/* Background Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Image</label>
              {bgImagePreview ? (
                <div className="relative group">
                  <img 
                    src={bgImagePreview} 
                    alt="Background preview" 
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    onClick={removeBgImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-teal-500 transition-colors"
                  onClick={() => bgImageInputRef.current.click()}
                >
                  <FiUpload className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-sm text-gray-500">Click to upload background image</p>
                  <p className="text-xs text-gray-400 mt-1">Recommended size: 1200x400px</p>
                  <input
                    type="file"
                    ref={bgImageInputRef}
                    onChange={handleBgImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              )}
            </div>
            
            {/* Main Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Image (Optional)</label>
              {mainImagePreview ? (
                <div className="relative group">
                  <img 
                    src={mainImagePreview} 
                    alt="Main image preview" 
                    className="w-full h-32 object-contain rounded-lg border border-gray-200"
                  />
                  <button
                    onClick={removeMainImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-teal-500 transition-colors"
                  onClick={() => mainImageInputRef.current.click()}
                >
                  <FiUpload className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-sm text-gray-500">Click to upload main image</p>
                  <p className="text-xs text-gray-400 mt-1">Product or featured image</p>
                  <input
                    type="file"
                    ref={mainImageInputRef}
                    onChange={handleMainImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summer Sale"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-teal-100 focus:border-teal-500 text-gray-700 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Limited time offers up to 50% off"
                rows="3"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-teal-100 focus:border-teal-500 text-gray-700 transition-all"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  placeholder="Shop Now"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-teal-100 focus:border-teal-500 text-gray-700 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                <input
                  type="text"
                  value={buttonLink}
                  onChange={(e) => setButtonLink(e.target.value)}
                  placeholder="/summer-sale"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-teal-100 focus:border-teal-500 text-gray-700 transition-all"
                />
              </div>
            </div>
            
            <button
              onClick={handleCreate}
              disabled={!bgImagePreview || !title}
              className={`w-full mt-4 px-6 py-3 rounded-lg font-medium text-white transition-all ${(!bgImagePreview || !title) ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 shadow-md hover:shadow-lg'} flex items-center justify-center`}
            >
              <FiPlus className="mr-2" />
              Create Banner
            </button>
          </div>
        </div>

        {/* Banners List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Your Banners ({banners.length})</h3>
            
            {banners.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                  <FiEye className="w-full h-full" />
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No banners created yet</h3>
                <p className="mt-1 text-gray-500">Create your first banner to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {banners.map((banner) => (
                  <div key={banner.id} className={`relative border rounded-xl overflow-hidden transition-all ${activeBannerId === banner.id ? 'ring-2 ring-teal-500 border-teal-500' : 'border-gray-200'}`}>
                    {/* Banner Image */}
                    <div className="h-40 bg-gray-100 overflow-hidden relative">
                      {banner.bgImage ? (
                        <>
                          <img 
                            src={banner.bgImage} 
                            alt={banner.title} 
                            className="w-full h-full object-cover"
                          />
                          {banner.mainImage && (
                            <img 
                              src={banner.mainImage} 
                              alt={banner.title} 
                              className="absolute bottom-4 right-4 h-3/5 object-contain"
                            />
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                          <span className="text-gray-500">Banner Preview</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Banner Info */}
                    <div className="p-4">
                      <h4 className="font-medium text-gray-800 truncate">{banner.title}</h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{banner.description}</p>
                      
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xs text-gray-500">
                          {new Date(banner.createdAt).toLocaleDateString()}
                        </span>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => deleteBanner(banner.id)}
                            className="p-2 text-red-500 hover:text-red-700 transition-colors"
                            title="Delete banner"
                          >
                            <FiTrash2 />
                          </button>
                          
                          <button
                            onClick={() => activateBanner(banner.id)}
                            className={`p-2 transition-colors ${activeBannerId === banner.id ? 'text-teal-500' : 'text-gray-400 hover:text-gray-600'}`}
                            title={activeBannerId === banner.id ? 'Active banner' : 'Set as active'}
                          >
                            <FiCheckCircle />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Active Badge */}
                    {activeBannerId === banner.id && (
                      <div className="absolute top-2 right-2 bg-teal-500 text-white text-xs px-2 py-1 rounded-full">
                        Active
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Active Banner Preview */}
          {activeBannerId && banners.find(b => b.id === activeBannerId) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Banner Preview</h3>
              <div className="border rounded-xl overflow-hidden">
                <div className="h-48 bg-gray-100 overflow-hidden relative">
                  <img 
                    src={banners.find(b => b.id === activeBannerId).bgImage || 'https://via.placeholder.com/1200x400?text=Banner+Image'} 
                    alt="Active banner" 
                    className="w-full h-full object-cover"
                  />
                  {banners.find(b => b.id === activeBannerId).mainImage && (
                    <img 
                      src={banners.find(b => b.id === activeBannerId).mainImage} 
                      alt="Main image"
                      className="absolute bottom-6 right-6 h-1/2 object-contain"
                    />
                  )}
                </div>
                <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
                  <h4 className="text-xl font-bold text-gray-800">
                    {banners.find(b => b.id === activeBannerId).title}
                  </h4>
                  <p className="text-gray-600 mt-2">
                    {banners.find(b => b.id === activeBannerId).description}
                  </p>
                  {banners.find(b => b.id === activeBannerId).buttonText && (
                    <a 
                      href={banners.find(b => b.id === activeBannerId).buttonLink || '#'}
                      className="inline-block mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      {banners.find(b => b.id === activeBannerId).buttonText}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banners;