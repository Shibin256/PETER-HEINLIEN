import React, { useState, useRef } from "react";
import {
  FiPlus,
  FiTrash2,
  FiEye,
  FiCheckCircle,
  FiUpload,
  FiX,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { createBanner, deleteBanner, fetchBanners, setActiveBanner } from "../../features/admin/banner/bannerSlice";
import { useEffect } from "react";
import Swal from "sweetalert2";

const Banners = () => {
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [buttonText, setButtonText] = useState("");
  const dispatch = useDispatch()

  // Image states
  const [bgImage, setBgImage] = useState(null);
  const [bgImagePreview, setBgImagePreview] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");

  const [loading, setLoading] = useState(false)
  const bgImageInputRef = useRef(null);
  const mainImageInputRef = useRef(null);

  const { banners } = useSelector(state => state.banner)

  const activeBanner = banners.find(banner => banner.isActive);

  useEffect(() => {
    dispatch(fetchBanners())
  }, [])

  const handleBgImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        toast.warning("Please select an image file (JPEG, PNG)");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.warning("File size should be less than 2MB");
        return;
      }
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
      if (!file.type.match("image.*")) {
        toast.warning("Please select an image file (JPEG, PNG)");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.warning("File size should be less than 2MB");
        return;
      }

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
    setBgImagePreview("");
    if (bgImageInputRef.current) {
      bgImageInputRef.current.value = "";
    }
  };

  const removeMainImage = () => {
    setMainImage(null);
    setMainImagePreview("");
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = "";
    }
  };

  const handleCreate = async () => {
    try {
      setLoading(true)
      if (!bgImagePreview || !title || !buttonText || !description) {
        toast.warning("All fields required");
        return;
      }
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("buttonText", buttonText);
      if (bgImage) formData.append("images", bgImage);
      if (mainImage) formData.append("images", mainImage);

      await dispatch(createBanner(formData))
      resetForm();
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setButtonText("");
    setBgImage(null);
    setBgImagePreview("");
    setMainImage(null);
    setMainImagePreview("");
  };

  const handledeleteBanner = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "This will delete the banner forever!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded mr-2",
          cancelButton:
            "bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded",
        },
      }).then((result) => {
        if (result.isConfirmed) {
           dispatch(deleteBanner({ bannerId: id })).then((res) => {
            if (res.type.endsWith("/fulfilled")) {
              Swal.fire(
                "Deleted!",
                `Brand and ${res.payload.deletedBrandCount} related product(s) deleted successfully.`,
                "success",
              )
            } else {
              Swal.fire(
                "Error!",
                res.payload?.message || "Failed to delete brand.",
                "error",
              );
            }
          })
           }
    })

        } catch (error) {
          console.log(error)
        }
      };

      const activateBanner = async (id) => {
        try {
          await dispatch(setActiveBanner({ bannerId: id }));
          dispatch(fetchBanners()); // Refresh the banners list to get updated active status
        } catch (error) {
          console.log(error)
        }
      };

      return (
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Banner Management
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Banner Creation Form */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Create New Banner
              </h3>

              <div className="space-y-4">
                {/* Background Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Background Image
                  </label>
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
                      <p className="text-sm text-gray-500">
                        Click to upload background image
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Recommended size: 1200x400px
                      </p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Main Image (Optional)
                  </label>
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
                      <p className="text-sm text-gray-500">
                        Click to upload main image
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Product or featured image
                      </p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Summer Sale"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-teal-100 focus:border-teal-500 text-gray-700 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={buttonText}
                      onChange={(e) => setButtonText(e.target.value)}
                      placeholder="Shop Now"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-teal-100 focus:border-teal-500 text-gray-700 transition-all"
                    />
                  </div>
                </div>

                <button
                  onClick={handleCreate}
                  disabled={!bgImagePreview || !title}
                  className={`w-full mt-4 px-6 py-3 rounded-lg font-medium text-white transition-all ${!bgImagePreview || !title ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700 shadow-md hover:shadow-lg"} flex items-center justify-center`}
                >
                  {!loading && <FiPlus className="mr-2" />}
                  {loading ? 'loading' : 'Create Banner'}
                </button>
              </div>
            </div>

            {/* Banners List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  Your Banners ({banners.length})
                </h3>

                {banners.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                      <FiEye className="w-full h-full" />
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      No banners created yet
                    </h3>
                    <p className="mt-1 text-gray-500">
                      Create your first banner to get started
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {banners.map((banner) => (
                      <div
                        key={banner._id}
                        className={`relative border rounded-xl overflow-hidden transition-all ${banner.isActive ? "ring-2 ring-teal-500 border-teal-500" : "border-gray-200"}`}
                      >
                        {/* Banner Image */}
                        <div className="h-40 bg-gray-100 overflow-hidden relative">
                          {banner.bannerImage ? (
                            <>
                              <img
                                src={banner.bannerImage}
                                alt={banner.title}
                                className="w-full h-full object-cover"
                              />
                              {banner.bagroundImage && (
                                <img
                                  src={banner.bagroundImage}
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
                          <h4 className="font-medium text-gray-800 truncate">
                            {banner.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            description : {banner.description}
                          </p>

                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            button text :{banner.buttonText}
                          </p>

                          <div className="flex justify-between items-center mt-4">
                            <span className="text-xs text-gray-500">
                              {new Date(banner.createdAt).toLocaleDateString()}
                            </span>

                            <div className="flex space-x-2">
                              <button
                                onClick={() => handledeleteBanner(banner._id)}
                                className="p-2 text-red-500 hover:text-red-700 transition-colors"
                                title="Delete banner"
                              >
                                <FiTrash2 />
                              </button>

                              <button
                                onClick={() => activateBanner(banner._id)}
                                className={`p-2 transition-colors ${banner.isActive ? "text-teal-500" : "text-gray-400 hover:text-gray-600"}`}
                                title={
                                  banner.isActive
                                    ? "Active banner"
                                    : "Set as active"
                                }
                              >
                                <FiCheckCircle />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Active Badge */}
                        {banner.isActive && (
                          <div className="absolute top-2 right-2 bg-teal-500 text-white text-xs px-2 py-1 rounded-full">
                            Active
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Banner Preview - Compact Version */}
              {activeBanner && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <h3 className="text-md font-semibold text-gray-800 mb-3">
                    Active Banner Preview
                  </h3>
                  <section className="relative w-full bg-gray-50 overflow-hidden rounded-lg">
                    {/* Background image with overlay */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src={activeBanner.bannerImage || "https://via.placeholder.com/1200x400?text=Banner+Image"}
                        alt="Banner background"
                        className="w-full h-full object-cover opacity-20"
                      />
                    </div>

                    <div className="relative z-10 px-4 py-12 sm:py-16">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
                        {/* Text content */}
                        <div className="text-center lg:text-left">
                          <h1 className="prata-regular text-2xl md:text-3xl font-bold mb-2 text-gray-900">
                            {activeBanner.title || "DISCOVER"}
                          </h1>
                          {activeBanner.description && (
                            <h2 className="text-xl md:text-2xl mb-4 text-gray-800">
                              {activeBanner.description}
                            </h2>
                          )}

                          <div className="border-t border-gray-300 my-4 w-3/4 lg:w-1/2 mx-auto lg:mx-0"></div>

                          <div className="mb-4">
                            {activeBanner.buttonText && (
                              <>
                                <p className="text-md md:text-lg mb-3 max-w-xl mx-auto lg:mx-0 text-gray-600">
                                  {activeBanner.additionalText || "Explore our premium collection"}
                                </p>
                                <button
                                  className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors duration-300 text-md font-medium"
                                >
                                  {activeBanner.buttonText}
                                </button>
                              </>
                            )}
                          </div>

                          <div className="border-t border-gray-300 my-4 w-3/4 lg:w-1/2 mx-auto lg:mx-0"></div>
                        </div>

                        {/* Image showcase */}
                        {activeBanner.bagroundImage && (
                          <div className="relative w-full lg:w-[350px] h-[250px]">
                            <div className="bg-white p-4 rounded-lg shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                              <img
                                src={activeBanner.bagroundImage}
                                alt="Featured product"
                                className="w-full h-auto object-contain"
                                width="90px"
                              />
                              <div className="absolute -bottom-4 -right-4 bg-yellow-100 px-3 py-1 rounded-lg shadow-md">
                                <span className="font-bold text-gray-800 text-xs">NEW</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    };

    export default Banners;