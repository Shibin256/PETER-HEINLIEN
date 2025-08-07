import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/products/productSlice";
import userReducer from "../features/users/userSlice";
import globalReducer from "../features/globalSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import accountReducer from "../features/accountSettings/accountSlice";
import cartReducer from "../features/cart/cartSlice";
import ordersReducer from "../features/orders/ordersSlice";
import couponsReducer from "../features/coupons/couponsSlice";
import walletReducer from "../features/wallet/walletSlice";
import dashboardReducer from "../features/admin/dashboard/dashboardSlice";
import bannerReducer from "../features/admin/banner/bannerSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    users: userReducer,
    global: globalReducer,
    wishlist: wishlistReducer,
    account: accountReducer,
    cart: cartReducer,
    orders: ordersReducer,
    coupons: couponsReducer,
    wallet: walletReducer,
    dashboard: dashboardReducer,
    banner:bannerReducer
  },
});
