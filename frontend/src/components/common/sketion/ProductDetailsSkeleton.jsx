const ProductDetailsSkeleton = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 py-12 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-1/2 bg-gray-200 h-[400px] rounded-xl"></div>

        <div className="w-full lg:w-1/2 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-20 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;