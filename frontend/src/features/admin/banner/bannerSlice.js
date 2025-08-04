import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import bannerService from "./bannerService";

const createBanner = createAsyncThunk(
  "banner/add",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await bannerService.createBanner(formData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

const bannerSlice = createSlice({
  name: "banner",
  initialState: {
    banners: [],
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetBannerState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // addProduct
      .addCase(createBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBanner.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetBannerState } = bannerSlice.actions;
export default bannerSlice.reducer;
