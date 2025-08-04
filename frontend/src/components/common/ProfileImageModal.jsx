import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { imageUpload } from "../../features/accountSettings/accountSlice";
import { setUser } from "../../features/auth/authSlice";

const ProfileImageModal = ({ isOpen, onClose, initialImage, user }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialImage);
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // for preview
    }
  };

  const handleSave = async () => {
    // if (selectedImage) {
    //     onSave(selectedImage);
    // }
    // onClose();

    const formData = new FormData();
    // console.log('selected img',selectedImage)
    formData.append("file", selectedFile);
    try {
      const res = await dispatch(
        imageUpload({ userId: user.id, data: formData }),
      ).unwrap();
      if (res) {
        toast.success("image added successfully");
        dispatch(setUser({ user: res }));
        onClose();
      }
    } catch (error) {
      toast.error(error?.message || "Failed to add product.");
    }
  };

  const handleDelete = () => {
    setSelectedFile(null);
    setPreviewUrl(initialImage);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96 shadow-xl relative">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Update Profile Picture
        </h2>

        <div className="flex flex-col items-center mb-4">
          {previewUrl ? (
            <>
              <img
                src={previewUrl}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover mb-3"
              />
              <button
                onClick={handleDelete}
                className="text-red-500 text-sm hover:underline mb-2"
              >
                Delete Image
              </button>
            </>
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 mb-3 flex items-center justify-center text-gray-400 text-sm">
              No Image
            </div>
          )}

          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm text-black"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-[#003543] hover:bg-[#004d5f] text-sm text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileImageModal;
