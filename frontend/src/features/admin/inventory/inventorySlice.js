import { createSlice, createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import inventoryService from "./inventoryService";

export const addCategory = createAsyncThunk(
    'addcategory',
    async (category, { rejectWithValue }) => {
        try {
            const res = await inventoryService.addCategory(category)
            console.log(res)
            return res
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    }
)

export const addBrand = createAsyncThunk(
    'addBand',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await inventoryService.addBrand(formData)
            return res
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Something went wrong');
        }

    }
)

const inventorySlice = createSlice({
    name: 'inventory',
    initialState: {
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
    }

})

export const { resetProductState } = inventorySlice.actions
export default inventorySlice.reducer














// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import inventoryService from "./inventoryService";

// // Add Category
// export const addCategory = createAsyncThunk(
//   'addCategory',
//   async (category, { rejectWithValue }) => {
//     try {
//       const res = await inventoryService.addCategory(category);
//       return res.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || 'Something went wrong');
//     }
//   }
// );

// // Add Brand
// export const addBrand = createAsyncThunk(
//   'addBrand',
//   async (formData, { rejectWithValue }) => {
//     try {
//       const res = await inventoryService.addBrand(formData);
//       return res.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || 'Something went wrong');
//     }
//   }
// );

// // Slice
// const inventorySlice = createSlice({
//   name: 'inventory',
//   initialState: {
//     loading: false,
//     success: false,
//     error: null,
//     category: null,
//     brand: null,
//   },
//   reducers: {
//     resetProductState: (state) => {
//       state.loading = false;
//       state.success = false;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(addCategory.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(addCategory.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = true;
//         state.category = action.payload;
//       })
//       .addCase(addCategory.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       .addCase(addBrand.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(addBrand.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = true;
//         state.brand = action.payload;
//       })
//       .addCase(addBrand.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   }
// });

// export const { resetProductState } = inventorySlice.actions;
// export default inventorySlice.reducer;
