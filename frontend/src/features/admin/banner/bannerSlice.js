import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import bannerService from "./bannerService";

export const createBanner = createAsyncThunk(
  "banner/add",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await bannerService.createBanner(formData);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const setActiveBanner = createAsyncThunk(
  "banner/setActiveBanner",
  async (bannerId, { rejectWithValue }) => {
    try {
      const res = await bannerService.setActiveBanner(bannerId);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const deleteBanner = createAsyncThunk(
  "banner/delete",
  async (bannerId, { rejectWithValue }) => {
    try {
      const res = await bannerService.deleteBanner(bannerId);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const fetchBanners = createAsyncThunk(
  "banner/get",
  async (_, { rejectWithValue }) => {
    try {
      const res = await bannerService.fetchBanners();
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const fetchHomeBanner = createAsyncThunk(
  "banner/fetchHomeBanner",
  async (_, { rejectWithValue }) => {
    try {
      const res = await bannerService.fetchHomeBanner();
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);



const bannerSlice = createSlice({
  name: "banner",
  initialState: {
    banners: [],
    homeBanner:{},
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
      .addCase(createBanner.fulfilled, (state,action) => {
        state.loading = false;
        state.success = true;
        state.banners.unshift(action.payload.banner)
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBanner.fulfilled, (state,action) => {
        state.loading = false;
        state.success = true;
        state.banners=action.payload.banners
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

        .addCase(setActiveBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(setActiveBanner.fulfilled, (state,action) => {
        state.loading = false;
        state.success = true;
        state.banners=action.payload.banners
      })
      .addCase(setActiveBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBanners.fulfilled, (state,action) => {
        state.loading = false;
        state.success = true;
        console.log(action.payload,'------')
        state.banners=action.payload.banners
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
       .addCase(fetchHomeBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHomeBanner.fulfilled, (state,action) => {
        state.loading = false;
        state.success = true;
        console.log(action.payload,'------')
        state.homeBanner=action.payload.banner
      })
      .addCase(fetchHomeBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      ;
  },
});

export const { resetBannerState } = bannerSlice.actions;
export default bannerSlice.reducer;
