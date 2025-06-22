import React, { useEffect, useState, useRef } from 'react';
import InventoryCard from '../../components/admin/InventoryCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, getBrandAndCollection } from '../../features/products/productSlice';
import { addBrand, addCategory, deleteBrand, deleteCategory, editBrand, } from '../../features/admin/inventory/inventorySlice';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const Inventory = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [selectedOption, setSelectedOption] = useState("category");
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategory, setNewCategory] = useState("");

    // Brand adding states
    const [isAddingBrand, setIsAddingBrand] = useState(false);
    const [newBrand, setNewBrand] = useState("");
    const [brandDescription, setBrandDescription] = useState("");
    const [brandLogo, setBrandLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const fileInputRef = useRef(null);

    //brand editing states
    const [isEditingBrand, setIsEditingBrand] = useState(false);
    const [editingBrandId, setEditingBrandId] = useState(null);
    const [editingBrandName, setEditingBrandName] = useState("");
    const [editingBrandDescription, setEditingBrandDescription] = useState("");
    const [editingBrandLogo, setEditingBrandLogo] = useState(null);
    const [editingLogoPreview, setEditingLogoPreview] = useState(null);

    const dispatch = useDispatch();
    //get all collection and brands
    useEffect(() => {
        dispatch(getBrandAndCollection())
    }, [dispatch])

    const { brands, categories, categoryBrandTotal } = useSelector(state => state.products)

    //the total category counts
    const categoryCounts = categories.map((cat) => {
        const count = categoryBrandTotal.filter(
            (product) => product.category === cat._id
        ).length;

        return {
            ...cat,
            total: count,
        };
    });

    //the total brand counts
    const brandCounts = brands.map((brand) => {
        const count = categoryBrandTotal.filter(
            (product) => product.brand === brand._id
        ).length;

        return {
            ...brand,
            total: count,
        };
    });

    //delete categrory
    const handleCategoryDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This will delete the category and all related products!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded mr-2',
                cancelButton: 'bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteCategory(id)).then((res) => {
                    if (res.type.endsWith('/fulfilled')) {
                        Swal.fire(
                            'Deleted!',
                            `Category and ${res.payload.deletedProductCount} related product(s) deleted successfully.`,
                            'success'
                        );
                        dispatch(getBrandAndCollection());
                    } else {
                        Swal.fire(
                            'Error!',
                            res.payload?.message || 'Failed to delete category.',
                            'error'
                        );
                    }
                });
            }
        });
    };

    const options = [
        { value: "category", label: "Category" },
        { value: "brand", label: "Brand" },
    ];

    //adding category modal popup
    const handleAddCategory = () => {
        setIsAddingBrand(false);
        setIsAddingCategory(true);
    };

    const handleSubmitCategory = async (e) => {
        e.preventDefault();
        try {
            if (newCategory.trim()) {
                const res = await dispatch(addCategory(newCategory.trim()))
                if (res.payload?.message === "Category created") {
                    toast.success("Category created successfully");
                    dispatch(getBrandAndCollection())
                } else if (res.payload?.message === "Category already exists") {
                    toast.warning("Category already exists");
                } else {
                    toast.error("Something went wrong");
                }
                setNewCategory("");
            }
            setIsAddingCategory(false);
        } catch (error) {
            toast.error(error?.message || 'Failed to update category.');
        }
    };

    //add brand modal shows
    const handleAddBrand = () => {
        setIsAddingCategory(false);
        setIsAddingBrand(true);
    }

    // file change of images
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type and size
            if (!file.type.match('image.*')) {
                toast.warning('Please select an image file (JPEG, PNG)');
                return;
            }
            if (file.size > 2 * 1024 * 1024) { // 2MB
                toast.warning('File size should be less than 2MB');
                return;
            }

            setBrandLogo(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleSubmitBrand = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        try {
            if (!newBrand.trim()) {
                toast.warning('Brand name is required');
                return;
            }

            if (!brandLogo) {
                toast.warning('Brand logo is required');
                return;
            }

            const formData = new FormData();
            formData.append('name', newBrand);
            formData.append('description', brandDescription);
            formData.append('logo', brandLogo);

            const res = await dispatch(addBrand(formData)).unwrap();
            console.log(res)
            if (res) {
                toast.success('Brand added successfully');
                dispatch(getBrandAndCollection())
                setNewBrand("");
                setBrandDescription("");
                setBrandLogo(null);
                setLogoPreview(null);
                setIsAddingBrand(false);
            } else {
                toast.error(res.payload?.message || 'Failed to add brand');
            }
        } catch (error) {
            toast.error(error?.message || 'Failed to add brand');
        } finally {
            setIsLoading(false)
        }
    }

    // brand edit
    const handleBrandEdit = (brand) => {
        setEditingBrandId(brand._id);
        setEditingBrandName(brand.name);
        setEditingBrandDescription(brand.description || "");
        setEditingLogoPreview(brand.logo?.url || null);
        setEditingBrandLogo(null);
        setIsEditingBrand(true);
    };

    // brand update
    const handleUpdateBrand = async (e) => {
        e.preventDefault();
        console.log('hiii')
        setIsLoading(true)
        try {
            if (!editingBrandName.trim()) {
                toast.warning('Brand name is required');
                return;
            }
            // if (!editingBrandLogo) {
            //     toast.warning('Brand need Logo image');
            //     return;
            // }
            // console.log(editingBrandLogo, '---------')
            const formData = new FormData();
            formData.append('name', editingBrandName);
            formData.append('description', editingBrandDescription);
            formData.append('logo', editingBrandLogo);

            // You'll need to create an updateBrand action in your inventorySlice
            const res = await dispatch(editBrand({ id: editingBrandId, data: formData })).unwrap();

            if (res) {
                toast.success('Brand updated successfully');
                dispatch(getBrandAndCollection());
                setIsEditingBrand(false);
            }
        } catch (error) {
            toast.error(error?.message || 'Failed to update brand');
        } finally {
            setIsLoading(false)
        }
    };

    //brand deletion
    const handleBrandDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This will delete the brand and all related products!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            buttonsStyling: false,
            customClass: {
                confirmButton:
                    'bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded mr-2',
                cancelButton:
                    'bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteBrand(id)).then((res) => {
                    if (res.type.endsWith('/fulfilled')) {
                        Swal.fire(
                            'Deleted!',
                            `Brand and ${res.payload.deletedBrandCount} related product(s) deleted successfully.`,
                            'success'
                        );
                        dispatch(getBrandAndCollection());
                    } else {
                        Swal.fire(
                            'Error!',
                            res.payload?.message || 'Failed to delete brand.',
                            'error'
                        );
                    }
                });
            }
        });
    };


    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Inventory Dashboard</h1>

            <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center">
                <div className="relative flex-1 w-full">
                    <select
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                        value={selectedOption}
                        onChange={(e) => {
                            setSelectedOption(e.target.value)
                            setIsAddingBrand(false)
                            setIsAddingCategory(false)
                        }}
                    >
                        {options.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                className={option.disabled ? "text-gray-400" : ""}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>

                <button
                    onClick={selectedOption === 'category' ? handleAddCategory : handleAddBrand}
                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md"
                >
                    {selectedOption === 'category' ? 'Add Category' : 'Add Brand'}
                </button>
            </div>

            {isAddingCategory && (
                <form onSubmit={handleSubmitCategory} className="mb-8 p-6 bg-blue-50 rounded-lg">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Enter new category name"
                            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAddingCategory(false)}
                                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            )}






            {isEditingBrand && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Edit Brand</h2>
                                <button
                                    onClick={() => setIsEditingBrand(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleUpdateBrand}>
                                {/* Image Upload with Preview */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Brand Logo
                                    </label>
                                    <div
                                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 overflow-hidden relative"
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        {editingLogoPreview ? (
                                            <img
                                                src={editingLogoPreview}
                                                alt="Brand logo preview"
                                                className="w-full h-full object-contain p-2"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-center p-4">
                                                <svg
                                                    className="w-10 h-10 mb-3 text-gray-400"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                <p className="mb-1 text-sm text-gray-500">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    PNG, JPG (MAX. 2MB)
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="hidden"
                                            accept="image/png, image/jpeg, image/jpg"
                                            onChange={(e) => {

                                                const file = e.target.files[0];
                                                console.log(file)
                                                if (file) {
                                                    if (!file.type.match('image.*')) {
                                                        toast.warning('Please select an image file (JPEG, PNG)');
                                                        return;
                                                    }
                                                    if (file.size > 2 * 1024 * 1024) {
                                                        toast.warning('File size should be less than 2MB');
                                                        return;
                                                    }

                                                    setEditingBrandLogo(file);
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setEditingLogoPreview(reader.result);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </div>
                                    {editingBrandLogo && (
                                        <p className="mt-1 text-xs text-gray-500">
                                            Selected: {editingBrandLogo.name}
                                        </p>
                                    )}
                                </div>

                                {/* Brand Name */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Brand Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={editingBrandName}
                                        onChange={(e) => setEditingBrandName(e.target.value)}
                                        placeholder="Enter brand name"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        placeholder="Enter brand description"
                                        value={editingBrandDescription}
                                        rows="3"
                                        onChange={(e) => setEditingBrandDescription(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingBrand(false)}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                                    >
                                        {isLoading ? 'Loading' : 'Update Brand'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}















            {isAddingBrand && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Add New Brand</h2>
                                <button
                                    onClick={() => {
                                        setIsAddingBrand(false);
                                        setLogoPreview(null);
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmitBrand}>
                                {/* Image Upload with Preview */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Brand Logo *
                                    </label>
                                    <div
                                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 overflow-hidden relative"
                                        onClick={triggerFileInput}

                                    >
                                        {logoPreview ? (
                                            <img
                                                src={logoPreview}
                                                alt="Brand logo preview"
                                                className="w-full h-full object-contain p-2"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-center p-4">
                                                <svg
                                                    className="w-10 h-10 mb-3 text-gray-400"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                <p className="mb-1 text-sm text-gray-500">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    PNG, JPG (MAX. 2MB)
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            id="brand-logo"
                                            type="file"
                                            className="hidden"
                                            accept="image/png, image/jpeg, image/jpg"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    {brandLogo && (
                                        <p className="mt-1 text-xs text-gray-500">
                                            Selected: {brandLogo.name}
                                        </p>
                                    )}
                                </div>

                                {/* Brand Name */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Brand Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={newBrand}
                                        onChange={(e) => setNewBrand(e.target.value)}
                                        placeholder="Enter brand name"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        placeholder="Enter brand description"
                                        value={brandDescription}
                                        rows="3"
                                        onChange={(e) => setBrandDescription(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsAddingBrand(false);
                                            setLogoPreview(null);
                                        }}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                                    >
                                        {isLoading ? 'Loading' : 'Add Brand'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {/* shows the categories */}
            {selectedOption === 'category' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {categoryCounts.map((category) => (
                        <InventoryCard
                            key={category._id}
                            title={`${category.categoryName} Collection`}
                            lastUpdated={new Date(category.updatedAt).toLocaleDateString()}
                            totalCollection={category.total}
                            deleteClick={() => handleCategoryDelete(category._id)}
                        />
                    ))}
                </div>
            )}

            {/* shows the brands */}
            {selectedOption === 'brand' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {brandCounts.map((brand) => (
                        <InventoryCard
                            key={brand._id}
                            title={`${brand.name} Collection`}
                            lastUpdated={new Date(brand.updatedAt).toLocaleDateString()}
                            totalCollection={brand.total}
                            editClick={() => handleBrandEdit(brand)}
                            deleteClick={() => handleBrandDelete(brand._id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Inventory;