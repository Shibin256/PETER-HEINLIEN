import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import productReducer from '../features/products/productSlice'
import userReducer from '../features/users/userSlice'
import globalReducer from '../features/globalSlice'
import wishlistReducer from '../features/wishlist/wishlistSlice'
export const store=configureStore({
    reducer:{
        auth:authReducer,
        products: productReducer,
        users: userReducer,
        global:globalReducer,
        wishlist:wishlistReducer
    }
})