/**
 * Orders Redux Slice
 * Manages user orders and order history
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import orderService from '@services/orderService'

const initialState = {
  list: [],
  currentOrder: null,
  loading: false,
  error: null,
}

/**
 * Create new order (checkout)
 * @param {Object} orderData - { shippingAddress, paymentMethodId }
 */
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderService.createOrder(orderData)
      return response.data // OrderDTO
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create order'
      )
    }
  }
)

/**
 * Fetch all user orders
 */
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrders()
      return response.data // Array of OrderDTO
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load orders'
      )
    }
  }
)

/**
 * Fetch single order by ID
 * @param {number} id - Order ID
 */
export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrderById(id)
      return response.data // OrderDTO
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Order not found'
      )
    }
  }
)

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {

    clearCurrentOrder: (state) => {
      state.currentOrder = null
    },

    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Create Order
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload
        state.list.unshift(action.payload) // Add new order to beginning
        state.error = null
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Fetch Orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
        state.error = null
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.list = []
      })

    // Fetch Order By ID
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload
        state.error = null
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.currentOrder = null
      })
  },
})

// Export actions
export const { clearCurrentOrder, clearError } = ordersSlice.actions

// Export selectors
export const selectOrders = (state) => state.orders.list
export const selectCurrentOrder = (state) => state.orders.currentOrder
export const selectOrdersLoading = (state) => state.orders.loading
export const selectOrdersError = (state) => state.orders.error

// Export reducer
export default ordersSlice.reducer
