import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  downloadSalesReportExcel,
  downloadSalesReportPdf,
  fetchSalesReport,
  getBestSellers,
} from "../../features/admin/dashboard/dashboardSlice";
import SalesDistribution from "../../components/admin/SalesDistribution";
import SalesTrend from "../../components/admin/SalesTrend ";
import BestSellerChart from "../../components/common/BestSellerChart";
import BestSellerChartSkeleton from "../../components/common/sketion/BestSellerChartSkeleton";

const Dashboard = () => {
  const [reportPeriod, setReportPeriod] = useState("Daily");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = useState("");
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [orders, setOrders] = useState([]);
  const [totalDiscounts, setTotalDiscounts] = useState(0);
  const [avgOrderValue, setAvgOrderValue] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("");
  const [loadingBestSellers, setLoadingBestSellers] = useState(true);

  const dispatch = useDispatch();
  // const { salesReport } = useSelector((state) => state.dashboard);

  const handleReportPeriodChange = (e) => {
    const today = new Date().toISOString().split("T")[0];
    setReportPeriod(e.target.value);
    setStartDate(today);
    setEndDate("");
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    dispatch(
      fetchSalesReport({
        type: "Daily",
        startDate: today,
        endDate: "",
      }),
    ).then((res) => {
      if (res.payload) {
        setOrders(res.payload.orders);
        setTotalSales(res.payload.totalSales);
        setTotalOrders(res.payload.totalOrders);
        setTotalDiscounts(res.payload.totalDiscount);
        setAvgOrderValue(res.payload.avgOrderValue);
      }
    });
  }, [dispatch]);

  useEffect(() => {
    setLoadingBestSellers(true);
    dispatch(getBestSellers()).then((res) => {
      setLoadingBestSellers(false);
    });
  }, [dispatch]);

  const { topProducts, topCategories, topBrands } = useSelector(
    (state) => state.dashboard,
  );


  const applyFilters = async () => {
    const today = new Date().toISOString().split("T")[0];

    if ((startDate && startDate > today) || (endDate && endDate > today)) {
      toast.warning("You cannot select upcoming dates.");
      return;
    }

    if (reportPeriod != "Custom Date Range" && startDate == "") {
      toast.warning("please select a date");
      return;
    }

    if (
      reportPeriod == "Custom Date Range" &&
      (startDate == "" || endDate == "")
    ) {
      toast.warning("Please select a date");
      return;
    }

    if (
      reportPeriod === "Custom Date Range" &&
      startDate &&
      endDate &&
      endDate < startDate
    ) {
      toast.warning("End date cannot be earlier than start date.");
      return;
    }

    const res = await dispatch(
      fetchSalesReport({ type: reportPeriod, startDate, endDate }),
    );
    setOrders(res.payload.orders);
    setTotalSales(res.payload.totalSales);
    setTotalOrders(res.payload.totalOrders);
    setTotalDiscounts(res.payload.totalDiscount);
    setAvgOrderValue(res.payload.avgOrderValue);
  };

  const resetFilters = () => {
    setReportPeriod("Custom Date Range");
    setStartDate("");
    setEndDate("");
    setTotalSales(0);
    setTotalOrders(0);
    setTotalDiscounts(0);
    setAvgOrderValue(0);
    setOrders([]);
  };

  const handleGenerateReport = () => {
    setShowModal(true);
  };

  const handleDownload = async () => {
    if (reportPeriod != "Custom Date Range" && startDate == "") {
      toast.warning("please select a date");
      return;
    }

    if (
      reportPeriod == "Custom Date Range" &&
      (startDate == "" || endDate == "")
    ) {
      toast.warning("Please select a date");
      return;
    }

    if (selectedFormat == "Excel") {
      await dispatch(
        downloadSalesReportExcel({ type: reportPeriod, startDate, endDate }),
      );
    } else {
      await dispatch(
        downloadSalesReportPdf({ type: reportPeriod, startDate, endDate }),
      );
    }
    setShowModal(false);
    setSelectedFormat("");
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedFormat("");
  };

  // Helper function to check if data is empty
  const isEmptyData = (data) => {
    return !data || data.length === 0;
  };

  // Render chart with loading and empty states
  const renderBestSellerChart = (title, data, color) => {
    if (loadingBestSellers) {
      return <BestSellerChartSkeleton />;
    }

    if (isEmptyData(data)) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <svg
              className="w-16 h-16 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p className="text-center">
              No data available for {title.toLowerCase()}
            </p>
            <p className="text-sm text-center mt-2">
              Try adjusting your filters or check back later
            </p>
          </div>
        </div>
      );
    }

    return <BestSellerChart title={title} data={data} color={color} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Generate Report
            </h3>
            <p className="text-gray-600 mb-4">
              Select the format for your report:
            </p>

            <div className="space-y-3 mb-6">
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedFormat === "PDF" ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:bg-gray-50"}`}
                onClick={() => setSelectedFormat("PDF")}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${selectedFormat === "PDF" ? "border-indigo-500 bg-indigo-500" : "border-gray-400"}`}
                  >
                    {selectedFormat === "PDF" && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">PDF Document</p>
                    <p className="text-sm text-gray-500">
                      High quality printable format
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedFormat === "Excel" ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:bg-gray-50"}`}
                onClick={() => setSelectedFormat("Excel")}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${selectedFormat === "Excel" ? "border-indigo-500 bg-indigo-500" : "border-gray-400"}`}
                  >
                    {selectedFormat === "Excel" && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Excel Spreadsheet</p>
                    <p className="text-sm text-gray-500">
                      Editable data format
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDownload}
                disabled={!selectedFormat}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${selectedFormat ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-300 cursor-not-allowed"}`}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">
              Track and analyze your sales performance
            </p>
          </div>
          <button
            onClick={handleGenerateReport}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors duration-200 mt-4 sm:mt-0"
          >
            Generate Report
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Sales Reports
          </h2>

          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
            <div className="flex-1">
              <label
                htmlFor="report-period"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Report Period
              </label>
              <select
                id="report-period"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={reportPeriod}
                onChange={handleReportPeriodChange}
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                <option value="Custom Date Range">Custom Date Range</option>
              </select>
            </div>

            {reportPeriod !== "Custom Date Range" && (
              <div className="flex-1">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            )}

            {reportPeriod === "Custom Date Range" && (
              <>
                <div className="flex-1">
                  <label
                    htmlFor="start-date"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Start Date
                  </label>
                  <input
                    id="start-date"
                    type="date"
                    max={new Date().toISOString().split("T")[0]} // Prevent future dates
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="end-date"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    End Date
                  </label>
                  <input
                    id="end-date"
                    type="date"
                    max={new Date().toISOString().split("T")[0]} // Prevent future dates
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors duration-200"
              onClick={applyFilters}
            >
              Apply Filters
            </button>
            <button
              className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors duration-200"
              onClick={resetFilters}
            >
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-xl shadow-sm border border-indigo-50">
              <p className="text-sm font-medium text-indigo-600">Total Sales</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                ₹{totalSales.toLocaleString()}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl shadow-sm border border-green-50">
              <p className="text-sm font-medium text-green-600">Total Orders</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {totalOrders}
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 rounded-xl shadow-sm border border-yellow-50">
              <p className="text-sm font-medium text-yellow-600">
                Total Discounts
              </p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                ₹{totalDiscounts}
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl shadow-sm border border-gray-50">
              <p className="text-sm font-medium text-gray-600">
                Avg. Order Value
              </p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                ₹{avgOrderValue.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="space-y-6 mt-4">
            {/* Top Section: 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SalesDistribution
                totalSales={totalSales}
                totalDiscount={totalDiscounts}
              />
              <SalesTrend orders={orders} />
            </div>

            {/* Bottom Section: 3 Charts with Loading/Empty States */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {renderBestSellerChart("Top Products", topProducts, "#4285F4")}
              {renderBestSellerChart(
                "Top Categories",
                topCategories,
                "#FFBB28",
              )}
              {renderBestSellerChart("Top Brands", topBrands, "#00C49F")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
