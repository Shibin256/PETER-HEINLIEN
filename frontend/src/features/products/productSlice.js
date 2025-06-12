import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const addProduct=createAsyncThunk(
    "products/addProduct",
    async (formData,{ rejectWithValue})=>{
        try {
          console.log(formData)
            const res=await axios.post(`${baseUrl}/api/products/add`,formData,{
                 headers: { "Content-Type": "multipart/form-data" },
            })
            console.log(res)
            return res.data
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)


const productSlice=createSlice({
    name:'products',
      initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers:{
    resetProductState:(state)=>{
        state.loading=false;
         state.success = false;
      state.error = null;
    },
  },
  extraReducers:(builder)=>{
        builder
        .addCase(addProduct.pending,(state)=>{
            state.loading=true
        })
        .addCase(addProduct.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
       .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
})

export const {resetProductState}=productSlice.actions
export default productSlice.reducer