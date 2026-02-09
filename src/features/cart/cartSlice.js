/**
 * Cart Redux Slice
 * Manages shopping cart state (guest and authenticated users)
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import cartService from '@services/cartService'
import { calculateCartTotal } from '@utils/helpers'

const initialState = {
  items: [],
  totalAmount: 0,
  loading: false,
  error: null,
}

/**
 * Fetch cart from backend (authenticated users)
 */
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart()
      return response.data // CartDTO with items and totalAmount
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load cart'
      )
    }
  }
)

/**
 * Add item to cart
 * @param {Object} payload - { productId, quantity }
 */
export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()

      // This thunk should only be called for authenticated users
      if (!auth.isAuthenticated) {
        return rejectWithValue('Must be authenticated to sync cart with backend')
      }

      const response = await cartService.addItem(
        payload.productId,
        payload.quantity
      )
      return response.data // Updated CartDTO
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add item to cart'
      )
    }
  }
)

/**
 * Remove item from cart
 * @param {number} productId - Product ID to remove
 */
export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()

      // This thunk should only be called for authenticated users
      if (!auth.isAuthenticated) {
        return rejectWithValue('Must be authenticated to sync cart with backend')
      }

      const response = await cartService.removeItem(productId)
      return response.data // Updated CartDTO
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove item from cart'
      )
    }
  }
)

/**
 * Update cart item quantity
 * @param {Object} payload - { productId, quantity }
 */
export const updateQuantityAsync = createAsyncThunk(
  'cart/updateQuantity',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()

      // This thunk should only be called for authenticated users
      if (!auth.isAuthenticated) {
        return rejectWithValue('Must be authenticated to sync cart with backend')
      }

      const response = await cartService.updateQuantity(
        payload.productId,
        payload.quantity
      )
      return response.data // Updated CartDTO
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update quantity'
      )
    }
  }
)

export const clearCartAsync = createAsyncThunk(
  'cart/clearCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()

      // This thunk should only be called for authenticated users
      if (!auth.isAuthenticated) {
        return rejectWithValue('Must be authenticated to sync cart with backend')
      }

      const response = await cartService.clearCart()
      return response.data // Empty CartDTO
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to clear cart'
      )
    }
  }
)

/**
 * Merge guest cart with user cart after login
 * @param {Array} guestCartItems - Guest cart items
 */
export const mergeCart = createAsyncThunk(
  'cart/mergeCart',
  async (guestCartItems, { rejectWithValue }) => {
    try {
      const response = await cartService.mergeCart(guestCartItems)
      return response.data // Merged CartDTO
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to merge cart'
      )
    }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Add item to cart (local/guest)
     */
    addItemLocal: (state, action) => {
      const { productId, productName, productPrice, productImageUrl, quantity } =
        action.payload

      const existingItem = state.items.find(
        (item) => item.productId === productId
      )

      if (existingItem) {
        existingItem.quantity += quantity
        existingItem.subtotal = (
          parseFloat(existingItem.productPrice) * existingItem.quantity
        ).toFixed(2)
      } else {
        state.items.push({
          productId,
          productName,
          productPrice,
          productImageUrl,
          quantity,
          subtotal: (parseFloat(productPrice) * quantity).toFixed(2),
        })
      }

      state.totalAmount = calculateCartTotal(state.items)
    },

    removeItemLocal: (state, action) => {
      const productId = action.payload
      state.items = state.items.filter((item) => item.productId !== productId)
      state.totalAmount = calculateCartTotal(state.items)
    },

    updateQuantityLocal: (state, action) => {
      const { productId, quantity } = action.payload
      const item = state.items.find((item) => item.productId === productId)

      if (item) {
        item.quantity = quantity
        item.subtotal = (parseFloat(item.productPrice) * quantity).toFixed(2)
        state.totalAmount = calculateCartTotal(state.items)
      }
    },

    clearCart: (state) => {
      state.items = []
      state.totalAmount = 0
      state.error = null
    },

    setCart: (state, action) => {
      state.items = action.payload.items || []
      state.totalAmount = action.payload.totalAmount || 0
    },

    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch Cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items || []
        state.totalAmount = parseFloat(action.payload.totalAmount || 0)
        state.error = null
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Add to Cart
    builder
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false

        // Authenticated users only - replace cart with backend response
        state.items = action.payload.items || []
        state.totalAmount = parseFloat(action.payload.totalAmount || 0)
        state.error = null
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Update Quantity
    builder
      .addCase(updateQuantityAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateQuantityAsync.fulfilled, (state, action) => {
        state.loading = false

        // Authenticated users only - replace cart with backend response
        state.items = action.payload.items || []
        state.totalAmount = parseFloat(action.payload.totalAmount || 0)
        state.error = null
      })
      .addCase(updateQuantityAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Remove from Cart
    builder
      .addCase(removeFromCartAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.loading = false

        // Authenticated users only - replace cart with backend response
        state.items = action.payload.items || []
        state.totalAmount = parseFloat(action.payload.totalAmount || 0)
        state.error = null
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Clear Cart
    builder
      .addCase(clearCartAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.loading = false

        // Clear cart for all users
        state.items = []
        state.totalAmount = 0
        state.error = null
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Merge Cart
    builder
      .addCase(mergeCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items || []
        state.totalAmount = parseFloat(action.payload.totalAmount || 0)
        state.error = null
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

// Export actions
export const {
  addItemLocal,
  removeItemLocal,
  updateQuantityLocal,
  clearCart,
  setCart,
  clearError,
} = cartSlice.actions

// Export selectors
export const selectCart = (state) => state.cart
export const selectCartItems = (state) => state.cart.items
export const selectCartTotal = (state) => state.cart.totalAmount
export const selectCartCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0)
export const selectCartLoading = (state) => state.cart.loading
export const selectCartError = (state) => state.cart.error

// Export reducer
export default cartSlice.reducer
