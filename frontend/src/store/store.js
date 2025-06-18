import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import productReducer from '../features/products/productSlice'
import userReducer from '../features/users/userSlice'
import globalReducer from '../features/globalSlice'
export const store=configureStore({
    reducer:{
        auth:authReducer,
        products: productReducer,
        users: userReducer,
        global:globalReducer
    }
})