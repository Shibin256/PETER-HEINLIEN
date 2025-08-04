import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Slider } from "@mui/material";
import { getCroppedImg } from "../../utils/cropUtils";

const CropModal = ({ imageSrc, onComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedPixels(croppedAreaPixels);
  }, []);

  const handleDone = async () => {
    const result = await getCroppedImg(imageSrc, croppedPixels);
    onComplete(result);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60  z-[9999]  flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-lg p-4 w-[90vw] max-w-md">
        <div className="relative w-full h-64 bg-gray-100 rounded overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="mt-4">
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e, z) => setZoom(z)}
          />
        </div>

        <div className="flex justify-end space-x-3 mt-4">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleDone}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropModal;
