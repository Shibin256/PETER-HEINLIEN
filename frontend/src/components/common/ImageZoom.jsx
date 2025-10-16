import React from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const ImageZoom = ({ imageUrl }) => {
  return (
    <div className="flex justify-center items-center">
      <Zoom>
        <img
          src={imageUrl}
          alt="Product"
          style={{
            width: "100%",
            maxWidth: "450px",
            borderRadius: "10px",
            objectFit: "cover",
            cursor: "zoom-in",
          }}
        />
      </Zoom>
    </div>
  );
};

export default ImageZoom;
