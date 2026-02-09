/**
 * Cart API Service
 * Handles shopping cart operations
 */

import api from './api'
import { API_ENDPOINTS } from '@constants'

const cartService = {

  getCart: async () => {
    return api.get(API_ENDPOINTS.CART.BASE)
  },

  addItem: async (productId, quantity) => {
    return api.post(API_ENDPOINTS.CART.ITEMS, { productId, quantity })
  },

  updateQuantity: async (productId, quantity) => {
    return api.put(API_ENDPOINTS.CART.REMOVE_ITEM(productId), { quantity })
  },

  removeItem: async (productId) => {
    return api.delete(API_ENDPOINTS.CART.REMOVE_ITEM(productId))
  },

  clearCart: async () => {
    return api.delete(API_ENDPOINTS.CART.BASE)
  },

  mergeCart: async (guestCartItems) => {
    return api.post(API_ENDPOINTS.CART.MERGE, { items: guestCartItems })
  },
}

export default cartService
