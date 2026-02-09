/**
 * useAuth Hook
 * Custom hook for authentication operations
 */

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  login as loginAction,
  register as registerAction,
  logoutUser,
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectIsAdmin,
  selectAuthLoading,
  selectAuthError,
  clearError,
} from '@features/auth/authSlice'
import { clearCart } from '@features/cart/cartSlice'
import { ROUTES } from '@constants'

/**
 * useAuth Hook
 * @returns {Object} Auth state and methods
 */
export const useAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const auth = useSelector(selectAuth)
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isAdmin = useSelector(selectIsAdmin)
  const loading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)

  /**
   * Login user
   * @param {Object} credentials - { email, password }
   */
  const login = async (credentials) => {
    await dispatch(loginAction(credentials)).unwrap()
    navigate(ROUTES.PRODUCTS)
  }

  /**
   * Register new user
   * @param {Object} userData - { firstName, lastName, email, password }
   */
  const register = async (userData) => {
    await dispatch(registerAction(userData)).unwrap()
    navigate(ROUTES.PRODUCTS)
  }

  const logout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
      dispatch(clearCart())
      navigate(ROUTES.LOGIN)
    } catch (error) {
      // Logout locally even if API fails
      dispatch(clearCart())
      navigate(ROUTES.LOGIN)
    }
  }

  const clearAuthError = () => {
    dispatch(clearError())
  }

  return {
    auth,
    user,
    isAuthenticated,
    isAdmin,
    loading,
    error,
    login,
    register,
    logout,
    clearAuthError,
  }
}

export default useAuth
