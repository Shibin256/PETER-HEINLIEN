import React from "react";
import ReactImageMagnify from "react-image-magnify";

const ImageZoom = ({ imageUrl }) => {
  return (
    <ReactImageMagnify
      {...{
        smallImage: {
          alt: "Product",
          isFluidWidth: true,
          src: imageUrl,
        },
        largeImage: {
          src: imageUrl,
          width: 1200,
          height: 1800,
        },
        enlargedImageContainerDimensions: {
          width: "185%",
          height: "105%",
        },
        enlargedImagePosition: "beside", // This is key
      }}
    />
  );
};

export default ImageZoom;
