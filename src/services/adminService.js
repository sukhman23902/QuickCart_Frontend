/**
 * Admin API Service
 * Handles admin panel operations (products, orders, users management)
 */

import api from './api'
import { API_ENDPOINTS } from '@constants'

const adminService = {
  // ==================== PRODUCT MANAGEMENT ====================
  createProduct: async (productData) => {
    return api.post(API_ENDPOINTS.ADMIN.PRODUCTS.BASE, productData)
  },

  updateProduct: async (id, productData) => {
    return api.put(API_ENDPOINTS.ADMIN.PRODUCTS.BY_ID(id), productData)
  },

  deleteProduct: async (id) => {
    return api.delete(API_ENDPOINTS.ADMIN.PRODUCTS.BY_ID(id))
  },

  // ==================== ORDER MANAGEMENT ====================
  getAllOrders: async () => {
    return api.get(API_ENDPOINTS.ADMIN.ORDERS.BASE)
  },

  updateOrderStatus: async (id, status) => {
    return api.put(API_ENDPOINTS.ADMIN.ORDERS.UPDATE_STATUS(id), { status })
  },

  // ==================== USER MANAGEMENT ====================
  getAllUsers: async () => {
    return api.get(API_ENDPOINTS.ADMIN.USERS.BASE)
  },

  getUserById: async (id) => {
    return api.get(API_ENDPOINTS.ADMIN.USERS.BY_ID(id))
  },

  updateUserStatus: async (id, isEnabled) => {
    return api.put(API_ENDPOINTS.ADMIN.USERS.UPDATE_STATUS(id), { isEnabled })
  },

  registerAdmin: async (adminData) => {
    return api.post(API_ENDPOINTS.ADMIN.USERS.REGISTER_ADMIN, adminData)
  },
}

export default adminService
