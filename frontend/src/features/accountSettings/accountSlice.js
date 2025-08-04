import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accountService from "./accountService";

export const changeName = createAsyncThunk(
  "user/account/changeName",
  async ({ userId, data }, thunkAPI) => {
    try {
      return await accountService.changeName(userId, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const changeMobile = createAsyncThunk(
  "user/account/changeMobile",
  async ({ userId, data }, thunkAPI) => {
    try {
      return await accountService.changeMobile(userId, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const changePassword = createAsyncThunk(
  "user/account/editPassword",
  async ({ userId, data }, thunkAPI) => {
    try {
      return await accountService.changePassword(userId, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const imageUpload = createAsyncThunk(
  "user/account/editProfile",
  async ({ userId, data }, thunkAPI) => {
    try {
      const res = await accountService.uploadImage(userId, data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const addAddress = createAsyncThunk(
  "user/account/addAdress",
  async ({ userId, data }, thunkAPI) => {
    try {
      const res = await accountService.addAddress(userId, data);
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const getAllAddress = createAsyncThunk(
  "user/account/getAllAddress",
  async (userId, thunkAPI) => {
    try {
      const res = await accountService.getAllAddress(userId);
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const removeAddress = createAsyncThunk(
  "user/account/removeAddress",
  async ({ userId, addressId }, thunkAPI) => {
    try {
      const res = await accountService.removeAddress(userId, addressId);
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const setDefault = createAsyncThunk(
  "user/account/setDefault",
  async ({ userId, addressId }, thunkAPI) => {
    try {
      const res = await accountService.setDefault(userId, addressId);
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const updateAddress = createAsyncThunk(
  "user/account/updateAdress",
  async ({ addressId, data }, thunkAPI) => {
    console.log(addressId);
    try {
      const res = await accountService.updateAdress(addressId, data);
      console.log(res, "sliceee");
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const accountSlice = createSlice({
  name: "account",
  initialState: {
    user: [],
    addresses: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetUser: (state) => {
      state.user = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changeName.pending, (state) => {
        state.loading = true;
      })
      .addCase(changeName.fulfilled, (state) => {
        state.loading = false;
        // state.user.push(action.payload);
      })
      .addCase(changeName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(changeMobile.pending, (state) => {
        state.loading = true;
      })
      .addCase(changeMobile.fulfilled, (state) => {
        state.loading = false;
        // state.user.push(action.payload);
      })
      .addCase(changeMobile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(changePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        // state.user.push(action.payload);
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(imageUpload.pending, (state) => {
        state.loading = true;
      })
      .addCase(imageUpload.fulfilled, (state, action) => {
        state.loading = false;
        state.user.push(action.payload);
        // console.log(action.payload,'aciton paylosd----------------')
      })
      .addCase(imageUpload.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.push(action.payload);
        // state.user.push(action.payload)
        // console.log(action.payload,'aciton paylosd----------------')
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.user.push(action.payload);
        state.addresses = action.payload.user.addresses;
      })
      .addCase(getAllAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.user.push(action.payload);
        state.addresses = action.payload.user.addresses;
        console.log(state.addresses, "adresss");
      })
      .addCase(removeAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUser } = accountSlice.actions;

export default accountSlice.reducer;
