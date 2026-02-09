/**
 * Axios API Client Configuration
 * Centralized HTTP client with JWT interceptors and error handling
 */

import axios from 'axios'
import { API_TIMEOUT } from '@constants'

// Get base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

/**
 * Create Axios instance with default configuration
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request Interceptor
 * - Inject JWT token in Authorization header for authenticated requests
 */
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (Redux Persist stores it there)
    const persistedState = localStorage.getItem('persist:root')

    if (persistedState) {
      try {
        const parsedState = JSON.parse(persistedState)
        const authState = JSON.parse(parsedState.auth || '{}')
        const token = authState.token

        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch (error) {
        console.error('Error parsing persisted state:', error)
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * - Handle common error responses
 * - Auto-logout on 401 Unauthorized
 */
api.interceptors.response.use(
  (response) => {
    // Return successful response
    return response
  },
  (error) => {
    if (error.response) {
      const { status } = error.response

      switch (status) {
        case 401:
          // Unauthorized - Clear auth state and redirect to login
          handleUnauthorized()
          break
        case 403:
          // Forbidden - User doesn't have permission
          console.error('Access forbidden:', error.response.data)
          break
        case 404:
          // Not Found
          console.error('Resource not found:', error.config.url)
          break
        case 500:
          // Internal Server Error
          console.error('Server error:', error.response.data)
          break
        default:
          console.error('API Error:', error.response.data)
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error:', error.message)
    } else {
      // Something else happened
      console.error('Error:', error.message)
    }

    return Promise.reject(error)
  }
)

/**
 * Handle 401 Unauthorized
 * - Clear persisted state
 * - Redirect to login page
 */
const handleUnauthorized = () => {
  // Clear Redux Persist state
  localStorage.removeItem('persist:root')

  // Only redirect if not already on login page
  if (window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

/**
 * API Helper Methods
 */

export const get = (url, config = {}) => {
  return api.get(url, config)
}

export const post = (url, data, config = {}) => {
  return api.post(url, data, config)
}

export const put = (url, data, config = {}) => {
  return api.put(url, data, config)
}

export default api
