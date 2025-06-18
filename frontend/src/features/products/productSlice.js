import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "./productService";
//handle add items
export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await productService.addProducts(formData)
      return res.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
)
//handle fetchinng product
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const products = await productService.getProducts()
      return products
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }

  }

)

//handle delete
export const deleteProduct = createAsyncThunk(
  'product/delete',
  async (id, { rejectWithValue }) => {
    try {
      const res = await productService.deleteProduct(id)
      return { id, ...res }
    } catch (error) {
      return rejectWithValue(err.response.data);
    }
  }
)
// handle update product
export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await productService.updateProduct(id, data)
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
)
//fetching brand and collection
export const getBrandAndCollection = createAsyncThunk(
  'product/getBrandAndCollection',
  async (_, { rejectWithValue }) => {
    try {
      const res = await productService.getBrandAndCollection()
      return res
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
)
//fetching single product
export const getProducById = createAsyncThunk(
  'product/getProductById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await productService.getProducById(id)
      console.log(res)
      return res
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');

    }
  }
)

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    brands: [],
    categories: [],
    singleProduct: {},
    loading: false,
    success: false,
    error: null,
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
      // addProduct
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateProduct
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getBrandAndCollection
      .addCase(getBrandAndCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBrandAndCollection.fulfilled, (state, action) => {
        const { brands, category } = action.payload
        state.brands = brands
        state.categories = category
        state.loading = false;
      })
      .addCase(getBrandAndCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getProductById
      .addCase(getProducById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleProduct = action.payload;
      })
      .addCase(getProducById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  }

})

export const { resetProductState } = productSlice.actions
export default productSlice.reducer