import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductOffer,
  deleteProduct,
  fetchProducts,
  getBrandAndCollection,
  removeProductOffer,
  updateProduct,
} from "../../features/products/productSlice";
import { toast } from "react-toastify";
import AuthInput from "../../components/common/AuthInput";
import SelectInput from "../../components/common/SelectInput";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaStar } from "react-icons/fa";

const ProductAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currency } = useSelector((state) => state.global);

  // State for offer management
  const [selectedProductForOffer, setSelectedProductForOffer] = useState(null);
  const [offerPercentage, setOfferPercentage] = useState("");
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [productToRemoveOffer, setProductToRemoveOffer] = useState(null);

  // Fetching category and brand from server
  useEffect(() => {
    dispatch(getBrandAndCollection());
  }, []);

  // Fetching products from server
  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 10 }));
  }, [dispatch]);

  const {
    brands,
    categories,
    page,
    totalPages,
    products,
    loading,
    error,
    totalProducts,
  } = useSelector((state) => state.products);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    quantity: "",
    price: "",
    category: "",
    brand: "",
    tags: "",
    images: [],
    newImages: [],
  });

  // Calculate product statistics
  const inStockCount =
    products?.filter((product) => product.availability).length || 0;
  const outOfStockCount =
    products?.filter((product) => !product.availability).length || 0;

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchProducts({ page: 1, limit: 10, search: searchTerm }));
  };

  // Offer management handlers
  const handleAddOffer = async () => {
    if (!selectedProductForOffer || !offerPercentage) return;
    if (offerPercentage <= 0 || offerPercentage > 100) {
      toast.error("Offer percentage must be between 1 and 100.");
      return;
    }

    try {
      const res = await dispatch(
        addProductOffer({
          productId: selectedProductForOffer._id,
          percentage: offerPercentage,
        }),
      )
      console.log(res, '-----')
      if (res.type.endsWith('fulfilled')) {
        toast.success(
          `Offer of ${offerPercentage}% added to ${selectedProductForOffer.name}`,
        );
      } else {
        toast.error(res.payload?.message)
      }
      setSelectedProductForOffer(null);
      setOfferPercentage("");
      dispatch(fetchProducts({ page, limit: 10, search: searchTerm }));
    } catch (error) {
      toast.error(error?.message || "Failed to add offer.");
    }
  };

  const handleRemoveOffer = (productId) => {
    setProductToRemoveOffer(productId);
    setShowRemoveConfirm(true);
  };

  const confirmRemoveOffer = async () => {
    try {
      const res = await dispatch(removeProductOffer(productToRemoveOffer));
      console.log("Offer removed:", res);
      if (res.type.endsWith("/rejected")) {
        toast.error(res.payload?.message || "Failed to remove offer.");
        return;
      }
      toast.success("✅ Offer removed successfully!");
      setShowRemoveConfirm(false);
      setProductToRemoveOffer(null);
      dispatch(fetchProducts({ page, limit: 10, search: searchTerm }));
    } catch (error) {
      toast.error(error?.message || "Failed to remove offer.");
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product, '====');
    setEditForm({
      name: product.name || "",
      description: product.description || "",
      quantity: product.totalQuantity || 0,
      price: product.price || "",
      category: product.category._id || "",
      brand: product.brand._id || "",
      tags: product.tags || "",
      images: product.images,
      newImages: [],
    });
    setShowEditModal(true);
  };

  // Handling edit submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      description,
      quantity,
      price,
      category,
      brand,
      tags,
    } = editForm;

    if (!name || !description || !price || !tags) {
      toast.error("Please fill all fields.");
      return;
    }

    if (isNaN(price) || price <= 0) {
      toast.error("Price must be a valid number.");
      return;
    }

    if (isNaN(quantity) || quantity < 0) {
      toast.error("Quantity must be a valid number.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("quantity", quantity);
    formData.append("price", price);
    formData.append("category", category._id);
    formData.append("brand", brand._id);
    formData.append("tags", tags);

    editForm.newImages.forEach((file, index) => {
      formData.append("newImages", file);
    });

    editForm.images.forEach((url) => {
      if (typeof url === "string") {
        formData.append("existingImages", url);
      }
    });

    try {
      const res = await dispatch(
        updateProduct({ id: selectedProduct._id, data: formData }),
      )
      if (res.type.endsWith('fulfilled')) {
        toast.success("✅ Product added successfully!");
        setShowEditModal(false);
        setSelectedProduct(null);
      } else {
        if (res.payload?.errors && Array.isArray(res.payload.errors)) {
          toast.error(res.payload.errors[0])
        } else {
          toast.error(res.payload?.message || "Failed to create product");
        }
      }
      dispatch(
        fetchProducts({ page: 1, limit: 10, search: searchTerm }),
      ).unwrap();
      navigate("/admin/products");
    } catch (error) {
      toast.error(error?.message || "Failed to update product.");
    }
  };

  // Handle product delete
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the product.",
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
        dispatch(deleteProduct(id)).then((res) => {
          if (res.type.endsWith("/fulfilled")) {
            toast.success("✅ Product deleted successfully!");
            dispatch(fetchProducts({ page: 1, limit: 10, search: searchTerm }));
          } else {
            toast.error(res.payload?.message || "Failed to delete product.");
          }
        });
      }
    });
  };

  // Edit modal cancel button handle
  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedProduct(null);
  };

  const categoryOptions = categories.map((category) => ({
    label: category.categoryName,
    value: category._id,
  }));

  const brandOptions = brands.map((brand) => ({
    label: brand.name,
    value: brand._id,
  }));

  if (loading) return <p className="text-center py-4">Loading products...</p>;
  if (error) {
    const errorMessage =
      typeof error === "string"
        ? error
        : error?.message || "An unknown error occurred.";
    return <p className="text-red-500 text-center">{errorMessage}</p>;
  }

  return (
    <div className="px-6 py-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Product Management</h2>

        <div className="flex flex-col md:flex-row items-end md:items-center gap-4 w-full md:w-auto">
          <div className="flex flex-wrap gap-2">
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg shadow-sm border border-blue-200 text-sm">
              Total: <span className="font-bold">{totalProducts || 0}</span>
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-lg shadow-sm border border-green-200 text-sm">
              In Stock: <span className="font-bold">{inStockCount}</span>
            </div>
            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-lg shadow-sm border border-red-200 text-sm">
              Out: <span className="font-bold">{outOfStockCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <AuthInput
            type="text"
            name="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by name..."
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
                setSearchTerm("");
                dispatch(fetchProducts({ page: 1, limit: 10 }));
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200 text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b">Image</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Quantity</th>
              <th className="px-4 py-2 border-b">Rating</th>
              <th className="px-4 py-2 border-b">Availability</th>
              <th className="px-4 py-2 border-b">Category</th>
              <th className="px-4 py-2 border-b">Price</th>
              <th className="px-4 py-2 border-b">Offer</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">
                  <img
                    src={product.images[0]}
                    alt="Product"
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-2">
                  {product.name}
                  {product.offerPercentage && (
                    <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      {product.offerPercentage}% OFF
                    </span>
                  )}
                </td>
                <td className="px-4 py-2">{product.totalQuantity}</td>
                <td className="px-4 py-6 flex items-center gap-1">
                  {product.averageRating}
                  <FaStar className="text-yellow-400" />
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${product.availability
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                      }`}
                  >
                    {product.availability ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {product.category?.categoryName || "N/A"}
                </td>
                <td className="px-4 py-2">
                  {product.offerPrice ? (
                    <>
                      <span className="line-through text-gray-400 mr-1">
                        ₹{product.price?.toFixed(2)}
                      </span>
                      <span className="text-red-600">
                        ₹{product.offerPrice.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    `₹${product.price?.toFixed(2)}`
                  )}
                </td>

                <td className="px-4 py-2 whitespace-nowrap">
                  {product.offerPercentage ? (
                    <button
                      onClick={() => handleRemoveOffer(product._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove Offer
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedProductForOffer(product)}
                      className="text-green-600 hover:text-green-800"
                    >
                      Add Offer
                    </button>
                  )}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Buttons */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={page <= 1}
            onClick={() =>
              dispatch(
                fetchProducts({
                  page: page - 1,
                  limit: 10,
                  search: searchTerm,
                }),
              )
            }
            className={`px-4 py-2 rounded ${page <= 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
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
                fetchProducts({
                  page: page + 1,
                  limit: 10,
                  search: searchTerm,
                }),
              )
            }
            className={`px-4 py-2 rounded ${page >= totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-center text-black">
              Edit Product
            </h2>
            <form onSubmit={handleEditSubmit}>
              <AuthInput
                label="Product Name"
                type="text"
                name="name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                placeholder="Enter product name"
                width="w-full"
                Textcolor="text-gray-700"
                borderColor="border-gray-300"
              />


              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="block w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  rows="4"
                  placeholder="Enter detailed product description..."
                />
              </div>

              {/* Image Upload Section */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {editForm.images?.map((image, index) => (
                    <div key={`existing-${index}`} className="relative">
                      <img
                        src={
                          typeof image === "string"
                            ? image
                            : URL.createObjectURL(image)
                        }
                        alt={`Existing product image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedImages = [...editForm.images];
                          updatedImages.splice(index, 1);
                          setEditForm({ ...editForm, images: updatedImages });
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {editForm.newImages?.map((image, index) => (
                    <div key={`new-${index}`} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`New image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedNewImages = [...editForm.newImages];
                          updatedNewImages.splice(index, 1);
                          setEditForm({
                            ...editForm,
                            newImages: updatedNewImages,
                          });
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {editForm.images.length + editForm.newImages.length < 4 && (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-xs text-gray-500 mt-2">
                          Upload Image
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const newFile = e.target.files[0];
                            if (
                              editForm.images.length +
                              editForm.newImages.length <
                              4
                            ) {
                              setEditForm({
                                ...editForm,
                                newImages: [...editForm.newImages, newFile],
                              });
                            }
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <SelectInput
                  label="Category"
                  value={editForm.category}
                  onChange={(value) =>
                    setEditForm({ ...editForm, category: value })
                  }
                  options={categoryOptions}
                  name="category"
                />
                {console.log(categoryOptions, '-----')}
                <SelectInput
                  label="Brand"
                  value={editForm.brand}
                  onChange={(value) =>
                    setEditForm({ ...editForm, brand: value })
                  }
                  options={brandOptions}
                  name="brand"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <AuthInput
                  label="Tags"
                  type="text"
                  name="tags"
                  value={editForm.tags}
                  onChange={(e) =>
                    setEditForm({ ...editForm, tags: e.target.value })
                  }
                  placeholder="e.g., new, sale, trendy"
                  width="w-full"
                  Textcolor="text-gray-700"
                  borderColor="border-gray-300"
                />
                <AuthInput
                  label="Price"
                  type="number"
                  name="price"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: e.target.value })
                  }
                  placeholder="Enter the amount"
                  width="w-full"
                  Textcolor="text-gray-700"
                  borderColor="border-gray-300"
                  icon={currency}
                />
                <AuthInput
                  label="Quantity"
                  type="number"
                  name="quantity"
                  value={editForm.quantity}
                  onChange={(e) =>
                    setEditForm({ ...editForm, quantity: e.target.value })
                  }
                  placeholder="Enter the Quantity"
                  width="w-full"
                  Textcolor="text-gray-700"
                  borderColor="border-gray-300"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="py-1.5 px-5 rounded-full text-gray-700 font-medium border border-gray-300 hover:bg-gray-100 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-5 rounded-full text-white font-medium bg-blue-600 hover:bg-blue-700 text-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Offer Modal */}
      {selectedProductForOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">
              Add Offer to {selectedProductForOffer.name}
            </h3>
            <input
              type="number"
              value={offerPercentage}
              onChange={(e) => setOfferPercentage(e.target.value)}
              placeholder="Enter percentage (e.g., 20)"
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
              min="1"
              max="100"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedProductForOffer(null);
                  setOfferPercentage("");
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOffer}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={!offerPercentage}
              >
                Apply Offer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Offer Confirmation Modal */}
      {showRemoveConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Confirm Remove Offer</h3>
            <p className="mb-4">Are you sure you want to remove this offer?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRemoveConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveOffer}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Remove Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAdmin;
