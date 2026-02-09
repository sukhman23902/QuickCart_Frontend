/**
 * Product API Service
 * Handles product catalog operations
 */

import api from './api'
import { API_ENDPOINTS } from '@constants'

const productService = {

  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    // Category filter
    if (filters.categoryId) params.append('categoryId', filters.categoryId)

    // Sort parameter
    if (filters.sortBy) params.append('sortBy', filters.sortBy)

    // Search query - convert from 'searchQuery' to 'q' for backend
    if (filters.searchQuery) params.append('q', filters.searchQuery)

    // Stock filter - only add if true
    if (filters.inStock) params.append('inStock', 'true')

    // Pagination
    if (filters.page !== undefined) params.append('page', filters.page)
    if (filters.size) params.append('size', filters.size)

    const queryString = params.toString()
    const url = queryString
      ? `${API_ENDPOINTS.PRODUCTS.BASE}?${queryString}`
      : API_ENDPOINTS.PRODUCTS.BASE

    return api.get(url)
  },

  getById: async (id) => {
    return api.get(API_ENDPOINTS.PRODUCTS.BY_ID(id))
  },

  search: async (query) => {
    return api.get(`${API_ENDPOINTS.PRODUCTS.BASE}?q=${encodeURIComponent(query)}`)
  },
}

export default productService
