import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from './cartService';

export const addToCart = createAsyncThunk(
    'user/cart/add',
    async ({ userId, productId, quantity = 1 }, thunkAPI) => {
        console.log(userId, '----', productId)
        try {
            return await cartService.addToCart({ userId, productId, quantity });
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


export const fetchCart = createAsyncThunk(
    'user/cart/fetchCart',
    async (userId) => {
        return await cartService.fetchCart(userId);
    });


export const removeFromCart = createAsyncThunk(
    'user/cart/removeFromCart',
    async ({ userId, productId, itemQuantity }) => {
        return await cartService.removeFromCart(userId, productId, itemQuantity)
    }
)

export const updateCart = createAsyncThunk(
    'user/cart/update',
    async ({ userId, productId, quantity = 1 }, thunkAPI) => {
        try {
            return await cartService.updateCart({ userId, productId, quantity });
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const wishlistToCart=createAsyncThunk(
    'user/cart/wishlistToCart',
    async({userId,productIds,quantity=1},thunkAPI)=>{
        try {
            return await cartService.wishlistToCart({ userId, productIds, quantity });
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: [],
        subTotal: 0,
        totalPrice: 0,
        loading: false,
        error: null
    },
    reducers: {
        resetCart: (state) => {
            state.cartItems = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
            })

            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload, 'in slice - updated cart');
                state.cartItems = action.payload.products;
            })


            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchCart.fulfilled, (state, action) => {
                console.log('slice', action.payload)
                state.cartItems = action.payload.products;
                state.subTotal = action.payload.subTotal;
                state.totalPrice = action.payload.totalPrice;
            })

            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload.products;
                state.subTotal = action.payload.subTotal;
                state.totalPrice = action.payload.totalPrice;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            .addCase(updateCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload.products;
                state.subTotal = action.payload.subTotal;
                state.totalPrice = action.payload.totalPrice;
            })
            .addCase(updateCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

              .addCase(wishlistToCart.pending, (state) => {
                state.loading = true;
            })

            .addCase(wishlistToCart.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload,'payload in wishlist')
                state.cartItems = action.payload.cart.products;
            })

            .addCase(wishlistToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { resetCart } = cartSlice.actions;

export default cartSlice.reducer;