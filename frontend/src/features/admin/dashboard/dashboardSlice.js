import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dashboardService from "./dashboardService"; // API calls for dashboard

//Fetch dashboard stats (orders, sales, revenue, users)
export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await dashboardService.getStats();
      return res; // Should return { totalSales, totalOrders, totalUsers, revenue }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch dashboard stats",
      );
    }
  },
);

// Fetch sales report (daily, weekly, monthly, yearly, custom)
export const fetchSalesReport = createAsyncThunk(
  "dashboard/fetchSalesReport",
  async ({ type, startDate, endDate }, { rejectWithValue }) => {
    try {
      const res = await dashboardService.getSalesReport({
        type,
        startDate,
        endDate,
      });
      console.log(res);
      return res; // Should return detailed sales data
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch sales report",
      );
    }
  },
);

//Fetch top-selling products
export const fetchTopProducts = createAsyncThunk(
  "dashboard/fetchTopProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await dashboardService.getTopProducts();
      return res; // Should return top-selling products
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch top products",
      );
    }
  },
);

export const downloadSalesReportExcel = createAsyncThunk(
  "dashboard/downloadSalesReportExcel",
  async ({ type, startDate, endDate }, { rejectWithValue }) => {
    try {
      const res = await dashboardService.downloadSalesReportExcel({
        type,
        startDate,
        endDate,
      });
      console.log(res);
      return res;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch sales report",
      );
    }
  },
);

export const downloadSalesReportPdf = createAsyncThunk(
  "dashboard/downloadSalesReportPdf",
  async ({ type, startDate, endDate }, { rejectWithValue }) => {
    try {
      const res = await dashboardService.downloadSalesReportPdf({
        type,
        startDate,
        endDate,
      });
      console.log(res);
      return res;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch sales report",
      );
    }
  },
);

// Slice
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    loading: false,
    error: null,
    stats: null, // { totalSales, totalOrders, totalUsers, revenue }
    salesReport: null, // Array of sales data (for chart/table)
    topProducts: [], // Array of best-selling products
    success: false,
  },
  reducers: {
    resetDashboardState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Sales Report
      .addCase(fetchSalesReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesReport.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.salesReport = action.payload;
      })
      .addCase(fetchSalesReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Top Products
      .addCase(fetchTopProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.topProducts = action.payload;
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetDashboardState } = dashboardSlice.actions;
export default dashboardSlice.reducer;
