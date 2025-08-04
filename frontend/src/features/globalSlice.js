import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currency: "₹ ",
  email: "shibinkp1012@gmail.com",
  mobile: 8157989254,
  delivaryFee: localStorage.getItem("delivaryFee")
    ? JSON.parse(localStorage.getItem("delivaryFee"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrency: (state, action) => {
      const { currency } = action.payload;
      state.currency = currency;
    },
    setDelivaryFee: (state, action) => {
      const { delivaryFee } = action.payload;
      state.currency = delivaryFee;
    },
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
