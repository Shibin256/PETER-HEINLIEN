const BestSellerChartSkeleton = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
    {/* Title */}
    <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>

    {/* Chart Area */}
    <div className="relative h-64 w-full flex items-end justify-between gap-4 px-4">
      {/* Y Axis Line */}
      <div className="absolute left-0 top-0 bottom-8 w-[2px] bg-gray-200"></div>

      {/* Bars */}
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="flex flex-col items-center justify-end gap-2"
        >
          {/* Revenue bar */}
          <div
            className="w-6 bg-gray-200 rounded"
            style={{ height: `${40 + item * 20}px` }}
          ></div>

          {/* Quantity bar */}
          <div
            className="w-6 bg-gray-300 rounded"
            style={{ height: `${30 + item * 15}px` }}
          ></div>

          {/* X-axis label */}
          <div className="h-3 bg-gray-200 rounded w-12 mt-2"></div>
        </div>
      ))}
    </div>

    {/* Legend */}
    <div className="flex gap-6 mt-6">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-300 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  </div>
);

export default BestSellerChartSkeleton;
