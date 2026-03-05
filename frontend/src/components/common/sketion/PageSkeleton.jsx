const PageSkeleton = () => {
  return (
    <div className="px-6 md:px-16 py-12 animate-pulse space-y-6">
      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
      <div className="h-6 bg-gray-200 rounded w-full"></div>
      <div className="h-6 bg-gray-200 rounded w-5/6"></div>
      <div className="h-6 bg-gray-200 rounded w-4/6"></div>
    </div>
  );
};

export default PageSkeleton;
