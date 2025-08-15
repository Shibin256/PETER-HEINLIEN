import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import orderService from "./orderService";

export const placeOrder = createAsyncThunk(
  "user/placeOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      console.log(orderData, "order data in slice");
      const res = await orderService.placeOrder(orderData);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const getOrders = createAsyncThunk(
  "user/getOrders",
  async ({ userId, search = "", page = 1, limit = 4 }, { rejectWithValue }) => {
    try {
      const res = await orderService.getOrders(userId, search, page, limit);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const cancelOrderItem = createAsyncThunk(
  "user/cancelOrderItem",
  async ({ itemOrderId, reason }, { rejectWithValue }) => {
    try {
      const res = await orderService.cancelOrderItem({
        itemOrderId: itemOrderId,
        reason: reason,
      });
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const cancelSingleOrderItem = createAsyncThunk(
  "user/cancelSingleOrderItem",
  async ({ itemOrderId, reason }, { rejectWithValue }) => {
    try {
      const res = await orderService.cancelSingleOrderItem({
        itemOrderId: itemOrderId,
        reason: reason,
      });
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const verifyCancel = createAsyncThunk(
  "user/verifyCancel",
  async (itemOrderId, { rejectWithValue }) => {
    try {
      const res = await orderService.cancelVerify(itemOrderId);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const changeOrderStatus = createAsyncThunk(
  "user/changestatus",
  async ({ itemOrderId, data }, { rejectWithValue }) => {
    try {
      const res = await orderService.changeOrderStatus({ itemOrderId, data });
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const fetchAllOrders = createAsyncThunk(
  "user/fetchAllOrders",
  async (
    { search = "", page = 1, limit = 8, sort = "" },
    { rejectWithValue },
  ) => {
    try {
      const response = await orderService.getALlOrders(
        search,
        page,
        limit,
        sort,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const returnOrderItem = createAsyncThunk(
  "user/returnOrderItem",
  async ({ itemOrderId, reason = "", deatials = "" }, { rejectWithValue }) => {
    try {
      const res = await orderService.returnOrderItem({
        itemOrderId: itemOrderId,
        reason: reason,
        deatials: deatials,
      });
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const retrunVerify = createAsyncThunk(
  "user/retrunVerify",
  async ({ itemOrderId }, { rejectWithValue }) => {
    try {
      const res = await orderService.retrunVerify(itemOrderId);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const singleCancelVerify = createAsyncThunk(
  "user/singleCancelVerify",
  async ({ itemOrderId }, { rejectWithValue }) => {
    try {
      const res = await orderService.singleCancelVerify(itemOrderId);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const downloadInvoice = createAsyncThunk(
  "user/downloadInvoice",
  async ({ itemOrderId }, { rejectWithValue }) => {
    try {
      await orderService.downloadInvoice(itemOrderId);
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const createPaymentOrder = createAsyncThunk(
  "order/createPaymentOrder",
  async ( totalPrice , thunkAPI) => {
    try {
      return await orderService.createRazorpayOrder(totalPrice);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

export const verifyPayment = createAsyncThunk(
  "order/verifyPayment",
  async (paymentDetails, thunkAPI) => {
    console.log(paymentDetails,'-------')
    try {
      return await orderService.verifyRazorpayPayment(paymentDetails);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

export const addReview = createAsyncThunk(
  "user/addReview",
  async ({itemId, rating = 0, review = "" }, { rejectWithValue }) => {
    try {
      const res = await orderService.submitReview({
        itemId: itemId,
        rating: rating,
        review: review,
      });
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);


export const updateOrderStatus = createAsyncThunk(
  "user/updateOrderStatus",
  async (orderId , { rejectWithValue }) => {
    console.log(orderId,'in slicee')
    try {
      const res = await orderService.updateOrderStatus(orderId);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    currentPlaceOrder: [],
    page: 1,
    paymentInfo:null,
    totalPage: 1,
    loading: false,
    success: false,
    error: null,
    paymentVerified: false,
  },
  reducers: {
    resetProductState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentPlaceOrder = action.payload.order;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.page = action.payload.page;
        state.totalPage = action.payload.totalPage;
        state.orders = action.payload.orders;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.paymentInfo = action.payload.paymentInfo;
        state.paymentVerified = action.payload.success;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.page = action.payload.page;
        state.totalPage = action.payload.totalPage;
        state.orders = action.payload.orders;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(returnOrderItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(returnOrderItem.fulfilled, (state, action) => {
        console.log(action.payload.order, "in slice");
        state.loading = false;
        state.success = true;
        state.orders = action.payload.order;
      })
      .addCase(returnOrderItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(retrunVerify.pending, (state) => {
        state.loading = true;
      })
      .addCase(retrunVerify.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orders = action.payload.order;
      })
      .addCase(retrunVerify.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(singleCancelVerify.pending, (state) => {
        state.loading = true;
      })
      .addCase(singleCancelVerify.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orders = action.payload.order;
      })
      .addCase(singleCancelVerify.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createPaymentOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPaymentOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { resetProductState } = orderSlice.actions;
export default orderSlice.reducer;
