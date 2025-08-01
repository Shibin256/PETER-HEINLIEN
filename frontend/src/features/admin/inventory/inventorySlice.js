import { createSlice, createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import inventoryService from "./inventoryService";

export const addCategory = createAsyncThunk(
    'admin/addcategory',
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

export const deleteCategory = createAsyncThunk(
    'admin/deleteCategory',
    async (id, { rejectWithValue }) => {
        try {
            const res = await inventoryService.deleteCategory(id)
            console.log(res)
            return res
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    })

    export const editCategory = createAsyncThunk(
    'admin/editBrand',
    async ({ id, name }, { rejectWithValue }) => {
        try {
            const res=await inventoryService.editCategory(id,name)
            return res
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)


export const addBrand = createAsyncThunk(
    'admin/addBand',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await inventoryService.addBrand(formData)
            return res
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Something went wrong');
        }

    }
)

export const deleteBrand = createAsyncThunk(
    'admin/deleteBrand',
    async (id, { rejectWithValue }) => {
        try {
            const res = await inventoryService.deleteBrnad(id)
            return res
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Something went wrong');

        }
    }
)

export const editBrand = createAsyncThunk(
    'admin/editBrand',
    async ({ id, data }, { rejectWithValue }) => {
        console.log(data)
        try {
            const res=await inventoryService.editBrand(id,data)
            console.log(res)
            return res
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const addCategoryOffer = createAsyncThunk(
  'product/addCategoryOffer',
  async ({ categoryId, percentage }, { rejectWithValue }) => {
    try {
      const res = await inventoryService.addCategoryOffer({categoryId, percentage});
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
)

export const removeCategoryOffer=createAsyncThunk(
  'product/removeCategoryOffer',
  async(categoryId,{ rejectWithValue })=>{
    try {
      const res = await inventoryService.removeCategoryOffer(categoryId);
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
