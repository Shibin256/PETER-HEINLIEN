import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import inventoryService from "./inventoryService";

export const addCategory = createAsyncThunk(
  "admin/addcategory",
  async (category, { rejectWithValue }) => {
    try {
      const res = await inventoryService.addCategory(category);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const deleteCategory = createAsyncThunk(
  "admin/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      const res = await inventoryService.deleteCategory(id);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const editCategory = createAsyncThunk(
  "admin/editBrand",
  async ({ id, category }, { rejectWithValue }) => {
    try {
      const res = await inventoryService.editCategory(id, category);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const addBrand = createAsyncThunk(
  "admin/addBand",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await inventoryService.addBrand(formData);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const deleteBrand = createAsyncThunk(
  "admin/deleteBrand",
  async (id, { rejectWithValue }) => {
    try {
      const res = await inventoryService.deleteBrnad(id);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const editBrand = createAsyncThunk(
  "admin/editBrand",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await inventoryService.editBrand(id, data);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const addCategoryOffer = createAsyncThunk(
  "product/addCategoryOffer",
  async ({ categoryId, percentage }, { rejectWithValue }) => {
    try {
      const res = await inventoryService.addCategoryOffer({
        categoryId,
        percentage,
      });
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const removeCategoryOffer = createAsyncThunk(
  "product/removeCategoryOffer",
  async (categoryId, { rejectWithValue }) => {
    try {
      const res = await inventoryService.removeCategoryOffer(categoryId);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

const inventorySlice = createSlice({
  name: "inventory",
  initialState: {},
  reducers: {
    resetProductState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder;
  },
});

export const { resetProductState } = inventorySlice.actions;
export default inventorySlice.reducer;
