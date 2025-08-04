import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import wishlistService from "./wishlistService";

export const addToWishlist = createAsyncThunk(
  "user/wishlist/add",
  async ({ userId, productId }, thunkAPI) => {
    try {
      return await wishlistService.addToWishlist({ userId, productId });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const getWishlist = createAsyncThunk(
  "user/wishlist/get",
  async (userId, thunkAPI) => {
    console.log(userId);
    try {
      return await wishlistService.getWishlist(userId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const getWishedProduct = createAsyncThunk(
  "user/wishlist/check",
  async ({ userId, productId }, thunkAPI) => {
    try {
      return await wishlistService.getWishedProduct({ userId, productId });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const removeFromWishlist = createAsyncThunk(
  "user/wishlist/remove",
  async ({ userId, productId }, thunkAPI) => {
    try {
      return await wishlistService.removeFromWishlist({ userId, productId });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlist: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetWishlist: (state) => {
      state.wishlist = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist.push(action.payload);
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = state.wishlist.filter(
          (item) => item.productId !== action.meta.arg.productId,
        );
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
