import React from 'react';
import ReactImageMagnify from 'react-image-magnify';

const ImageZoom = ({ imageUrl }) => {
  return (
    <ReactImageMagnify
      {...{
        smallImage: {
          alt: 'Product',
          isFluidWidth: true,
          src: imageUrl,
        },
        largeImage: {
          src: imageUrl,
          width: 900,
          height: 900,
        },
        enlargedImageContainerDimensions: {
          width: '150%',
          height: '110%',
        },
        enlargedImagePosition: 'beside', // This is key
      }}
    />
  );
};

export default ImageZoom;
