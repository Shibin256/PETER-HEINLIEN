import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import couponsService from "./couponsService";

export const createCoupons = createAsyncThunk(
  "admin/createCoupons",
  async (data, { rejectWithValue }) => {
    try {
      const res = await couponsService.createCoupons(data);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const fetchCoupons = createAsyncThunk(
  "admin/fetchCoupons",
  async ({ search = "", page = 1, limit = 8 }, { rejectWithValue }) => {
    try {
      const res = await couponsService.fetchAllCoupons(search, page, limit);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const fetchUserCoupons = createAsyncThunk(
  "admin/fetchUserCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const res = await couponsService.fetchUserCoupons();
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const fetchAdsCoupons = createAsyncThunk(
  "admin/fetchAdsCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const res = await couponsService.fetchAdsCoupons();
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const deleteCoupon = createAsyncThunk(
  "admin/deleteCoupon",
  async (couponId, { rejectWithValue }) => {
    try {
      const res = await couponsService.deleteCoupon(couponId);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const updateCoupon = createAsyncThunk(
  "admin/updateCoupon",
  async (data, { rejectWithValue }) => {
    try {
      const res = await couponsService.updateCoupon(data);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const applyCoupon = createAsyncThunk(
  "user/cart/applyCoupon",
  async ({ userId, couponCode }, thunkAPI) => {
    try {
      console.log(userId, couponCode, "in coupons slice");
      return await couponsService.applyCoupon({ userId, couponCode });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const removeCoupon = createAsyncThunk(
  "user/cart/removeCoupon",
  async ({ userId, couponCode }, thunkAPI) => {
    try {
      console.log(userId, couponCode, "in coupons slice");
      // Assuming there's a service method to remove the coupon
      return await couponsService.removeCoupon(userId, couponCode);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const couponsSlice = createSlice({
  name: "coupons",
  initialState: {
    coupons: [],
    userCoupons:[],
    adsCoupon:null,
    coupon: null,
    page: 1,
    totalPages: 1,
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetCouponState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCoupons.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.coupons = action.payload.coupons;
      })
      .addCase(createCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.coupons = action.payload.coupons;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

       .addCase(fetchAdsCoupons.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdsCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.adsCoupon = action.payload.coupon;
      })
      .addCase(fetchAdsCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
       .addCase(fetchUserCoupons.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.userCoupons = action.payload.coupons;
      })
      .addCase(fetchUserCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.coupon = action.payload.coupon;
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.coupon = action.payload.coupon;
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCouponState } = couponsSlice.actions;
export default couponsSlice.reducer;
