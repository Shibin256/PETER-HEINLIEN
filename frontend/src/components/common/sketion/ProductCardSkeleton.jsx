const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
      <div className="bg-gray-200 h-48 w-full rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
};

export default ProductCardSkeleton;
