/**
 * Wishlist API Service
 * Handles wishlist/favorites operations
 * Note: Backend API endpoints need to be implemented
 */

import api from './api'
import { API_ENDPOINTS } from '@constants'

const wishlistService = {

  getWishlist: async () => {
    return api.get(API_ENDPOINTS.WISHLIST.BASE)
  },

  addItem: async (productId) => {
    return api.post(API_ENDPOINTS.WISHLIST.ITEMS, { productId })
  },

  removeItem: async (productId) => {
    return api.delete(API_ENDPOINTS.WISHLIST.REMOVE_ITEM(productId))
  },
}

export default wishlistService
