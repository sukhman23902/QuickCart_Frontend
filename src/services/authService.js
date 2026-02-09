/**
 * Authentication API Service
 * Handles user authentication and registration
 */

import api from './api'
import { API_ENDPOINTS } from '@constants'

const authService = {

  login: async (credentials) => {
    return api.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
  },

  register: async (userData) => {
    return api.post(API_ENDPOINTS.AUTH.REGISTER, userData)
  },

  logout: async () => {
    return api.post(API_ENDPOINTS.AUTH.LOGOUT)
  },
}

export default authService
