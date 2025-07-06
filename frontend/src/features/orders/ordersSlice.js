import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import orderService from "./orderService";

export const placeOrder = createAsyncThunk(
    'user/placeOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            console.log(orderData, 'order data in slice');
            const res = await orderService.placeOrder(orderData);
            return res
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    }
)

export const getOrders = createAsyncThunk(
    'user/getOrders',
    async (userId, { rejectWithValue }) => {
        try {
            const res = await orderService.getOrders(userId);
            return res;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    })

export const cancelOrderItem = createAsyncThunk(
    'user/cancelOrderItem',
    async ({ itemOrderId, reason }, { rejectWithValue }) => {
        try {
            const res = await orderService.cancelOrderItem({ itemOrderId: itemOrderId, reason: reason });
            return res;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    }
)

export const verifyCancel=createAsyncThunk(
    'user/verifyCancel',
    async(itemOrderId, { rejectWithValue }) => {
        try {
            const res = await orderService.cancelVerify(itemOrderId );
            return res;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    }
)

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        loading: false,
        success: false,
        error: null,
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
                state.orders.push(action.payload);
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
                state.orders = action.payload;
            })
            .addCase(getOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export const { resetProductState } = orderSlice.actions;
export default orderSlice.reducer;