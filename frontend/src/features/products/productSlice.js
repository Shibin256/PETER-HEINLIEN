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
export const fetchCollection = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const latestCollection = await productService.getLatestCollection()
      return latestCollection
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }

  }

)

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page = 1, limit = 8, search = '', categories = [], brands = [], sort = '', order = '' }, thunkAPI) => {
    try {
      // console.log(categories,brands,sort,'------------',order)
      const params = new URLSearchParams({ page, limit });

      if (search) params.append('search', search);
      if (categories.length) params.append('categories', categories.join(','));
      if (brands.length) params.append('brands', brands.join(','));
      if (sort) params.append('sort', sort);
      if (order) params.append('order', order);

      const response = await productService.getProducts(params);
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

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
      return res
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
)

export const relatedProducts=createAsyncThunk(
  'product/relatedProduct',
  async(id,{rejectWithValue})=>{
    try {
      const res=await productService.getRelatedProducts(id)
      return res
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
      
    }
  }
)

export const addProductOffer = createAsyncThunk(
  'product/addProductOffer',
  async ({ productId, percentage }, { rejectWithValue }) => {
    try {
      console.log('Adding product offer:', { productId, percentage });
      const res = await productService.addProductOffer({productId, percentage});
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
)

export const removeProductOffer=createAsyncThunk(
  'product/removeProductOffer',
  async(productId,{ rejectWithValue })=>{
    try {
      const res = await productService.removeProductOffer(productId);
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
    productsRelated:[],
    latestCollection:[],
    page: 1,
    totalPages: 1,
    brands: [],
    categories: [],
    categoryBrandTotal: [],
    brandTotal: [],
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
        const { products, total, page, totalPages } = action.payload;
        state.products = products;
        state.page = page;
        state.totalPages = totalPages; // Add this line
        state.hasMore = page < totalPages;
        state.loading = false;
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

        // latestCollection
      .addCase(fetchCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollection.fulfilled, (state, action) => {
        state.loading = false;
        state.latestCollection = action.payload.latestCollection;
      })
      .addCase(fetchCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getBrandAndCollection
      .addCase(getBrandAndCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBrandAndCollection.fulfilled, (state, action) => {
        const { brands, category ,result} = action.payload
        state.brands = brands
        state.categories = category
        state.loading = false;
        state.categoryBrandTotal=result;
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
      })

      // getRelatedProduct
      .addCase(relatedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(relatedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.productsRelated = action.payload;
      })
      .addCase(relatedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  }

})

export const { resetProductState } = productSlice.actions
export default productSlice.reducer