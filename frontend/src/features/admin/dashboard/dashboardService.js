import adminAxiosInstance from "../../../api/adminAxiosInstance";

const getStats = async () => {
  const res = await adminAxiosInstance.get("/api/admin/dashboard/stats");
  return res.data;
};

const getSalesReport = async ({ type, startDate, endDate }) => {
  console.log(type, startDate);
  const res = await adminAxiosInstance.get(
    "/api/v1/admin/sales/report",
    {
      params: { type, startDate, endDate },
    },
  );
  return res.data;
};

const downloadSalesReportPdf = async ({ type, startDate, endDate }) => {
  console.log(type, startDate);
  const res = await adminAxiosInstance.get(
    "/api/v1/admin/sales/report/pdf",
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
    "/api/v1/admin/sales/report/excel",
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
  const res = await adminAxiosInstance.get("/api/v1/admin/bestsellers");
  return res.data;
};

const dashboardService = {
  getStats,
  getSalesReport,
  downloadSalesReportPdf,
  downloadSalesReportExcel,
  getBestSellers
};

export default dashboardService;
