import adminAxiosInstance from "../../../api/adminAxiosInstance";

// Get overall stats (sales, orders, revenue, users)
const getStats = async () => {
  const res = await adminAxiosInstance.get("/api/admin/dashboard/stats");
  return res.data;
};

// Get sales report (daily, weekly, monthly, yearly, or custom range)
const getSalesReport = async ({ type, startDate, endDate }) => {
  console.log(type, startDate);
  const res = await adminAxiosInstance.get(
    "/api/admin/dashboard/sales-report",
    {
      params: { type, startDate, endDate },
    },
  );
  return res.data;
};

// Get top-selling products
const getTopProducts = async () => {
  const res = await adminAxiosInstance.get("/api/admin/dashboard/top-products");
  return res.data;
};

// Get recent orders for dashboard
const getRecentOrders = async () => {
  const res = await adminAxiosInstance.get(
    "/api/admin/dashboard/recent-orders",
  );
  return res.data;
};

const downloadSalesReportPdf = async ({ type, startDate, endDate }) => {
  console.log(type, startDate);
  const res = await adminAxiosInstance.get(
    "/api/admin/dashboard/sales-report/pdf",
    {
      params: { type, startDate, endDate },
      responseType: "blob",
    },
  );

  const blob = new Blob([res.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `SalesReport-${startDate}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
  return res.data;
};
const downloadSalesReportExcel = async ({ type, startDate, endDate }) => {
  const res = await adminAxiosInstance.get(
    "/api/admin/dashboard/sales-report/excel",
    {
      params: { type, startDate, endDate },
      responseType: "blob",
    },
  );

  const blob = new Blob([res.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  // Set filename dynamically
  const fileName = `SalesReport-${startDate || new Date().toISOString().split("T")[0]}.xlsx`;
  link.setAttribute("download", fileName);

  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};



const getBestSellers = async () => {
  const res = await adminAxiosInstance.get("/api/admin/dashboard/best-sellers");
  return res.data;
};

const dashboardService = {
  getStats,
  getSalesReport,
  getTopProducts,
  getRecentOrders,
  downloadSalesReportPdf,
  downloadSalesReportExcel,
  getBestSellers
};

export default dashboardService;
