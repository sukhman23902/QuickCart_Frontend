/**
 * Order API Service
 * Handles order operations and checkout
 */

import api from './api'
import { API_ENDPOINTS } from '@constants'

const orderService = {

  createOrder: async (orderData) => {
    return api.post(API_ENDPOINTS.ORDERS.BASE, orderData)
  },

  getOrders: async () => {
    return api.get(API_ENDPOINTS.ORDERS.BASE)
  },

  getOrderById: async (id) => {
    return api.get(API_ENDPOINTS.ORDERS.BY_ID(id))
  },
}

export default orderService
