import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import walletService from "./walletService";

export const addToWallet = createAsyncThunk(
  "add/wallet",
  async ({ userId, amount, paymentId }, thunkAPI) => {
    try {
      return await walletService.addToWallet(userId, amount, paymentId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const getWallet = createAsyncThunk(
  "get/wallet",
  async ({ userId, page = 1, limit = 8 }, thunkAPI) => {
    try {
      console.log(userId,'in wallet')
      return await walletService.getWallet(userId, page, limit);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    walletAmount: 0,
    transactions: [],
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
      .addCase(getWallet.pending, (state) => {
        state.error = null;
      })
      .addCase(getWallet.fulfilled, (state, action) => {
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPage
        state.walletAmount = action.payload.wallet.balance;
        state.transactions = action.payload.wallet.transactions;
      })
      .addCase(getWallet.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(addToWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.walletAmount = action.payload.wallet.balance;
        state.transactions = action.payload.wallet.transactions;
      })
      .addCase(addToWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCouponState } = walletSlice.actions;
export default walletSlice.reducer;
