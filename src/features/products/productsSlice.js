/**
 * Products Redux Slice
 * Manages product catalog, filters, and pagination
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import productService from '@services/productService'
import { FILTER_DEFAULTS } from '@constants'

const initialState = {
  list: [],
  selectedProduct: null,
  filters: FILTER_DEFAULTS,
  pagination: {
    page: 0,
    size: 12,
    totalPages: 0,
    totalElements: 0,
  },
  loading: false,
  error: null,
}

/**
 * Fetch all products with filters
 * @param {Object} filters - Filter parameters
 */
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await productService.getAll(filters)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load products'
      )
    }
  }
)

/**
 * Fetch single product by ID
 * @param {number} id - Product ID
 */
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.getById(id)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Product not found'
      )
    }
  }
)

/**
 * Products Slice
 */
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {

    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },

    clearFilters: (state) => {
      state.filters = FILTER_DEFAULTS
    },

    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload
    },

    clearSelectedProduct: (state) => {
      state.selectedProduct = null
    },

    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },

    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false

        // Check if response has pagination metadata
        if (action.payload.content) {
          // Paginated response
          state.list = action.payload.content
          state.pagination = {
            page: action.payload.number || 0,
            size: action.payload.size || 12,
            totalPages: action.payload.totalPages || 0,
            totalElements: action.payload.totalElements || 0,
          }
        } else {
          // Simple array response
          state.list = action.payload
        }

        state.error = null
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.list = []
      })

    // Fetch Product By ID
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedProduct = action.payload
        state.error = null
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.selectedProduct = null
      })
  },
})

// Export actions
export const {
  setFilters,
  clearFilters,
  setSelectedProduct,
  clearSelectedProduct,
  setPagination,
  clearError,
} = productsSlice.actions

// Export selectors
export const selectProducts = (state) => state.products.list
export const selectSelectedProduct = (state) => state.products.selectedProduct
export const selectFilters = (state) => state.products.filters
export const selectPagination = (state) => state.products.pagination
export const selectProductsLoading = (state) => state.products.loading
export const selectProductsError = (state) => state.products.error

// Export reducer
export default productsSlice.reducer
