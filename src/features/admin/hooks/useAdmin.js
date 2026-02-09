/**
 * useAdmin Hook
 * Custom hook for admin panel operations
 * Uses local state management (no Redux slice)
 */

import { useState, useCallback } from 'react'
import { useSnackbar } from 'notistack'
import adminService from '@services/adminService'
import productService from '@services/productService'
import api from '@services/api'
import { API_ENDPOINTS, MESSAGES } from '@constants'

/**
 * useAdmin Hook
 * @returns {Object} Admin state and methods
 */
export const useAdmin = () => {
  const { enqueueSnackbar } = useSnackbar()

  // Products state
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [productsError, setProductsError] = useState(null)

  // Orders state
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState(null)

  // Users state
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState(null)

  // Categories state (for product form)
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)

  // ==================== PRODUCTS ====================

  /**
   * Load all products
   */
  const loadProducts = useCallback(async () => {
    setProductsLoading(true)
    setProductsError(null)
    try {
      const response = await productService.getAll({ size: 1000 })
      const productList = response.data.content || response.data
      setProducts(productList)
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load products'
      setProductsError(message)
      enqueueSnackbar(message, { variant: 'error' })
    } finally {
      setProductsLoading(false)
    }
  }, [enqueueSnackbar])

  /**
   * Create new product
   * @param {Object} productData - Product data
   */
  const createProduct = useCallback(async (productData) => {
    try {
      const response = await adminService.createProduct(productData)
      setProducts((prev) => [...prev, response.data])
      enqueueSnackbar(MESSAGES.SUCCESS.PRODUCT_CREATED, { variant: 'success' })
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create product'
      enqueueSnackbar(message, { variant: 'error' })
      throw error
    }
  }, [enqueueSnackbar])

  /**
   * Update product
   * @param {number} id - Product ID
   * @param {Object} productData - Updated product data
   */
  const updateProduct = useCallback(async (id, productData) => {
    try {
      const response = await adminService.updateProduct(id, productData)
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? response.data : p))
      )
      enqueueSnackbar(MESSAGES.SUCCESS.PRODUCT_UPDATED, { variant: 'success' })
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update product'
      enqueueSnackbar(message, { variant: 'error' })
      throw error
    }
  }, [enqueueSnackbar])

  /**
   * Delete product
   * @param {number} id - Product ID
   */
  const deleteProduct = useCallback(async (id) => {
    try {
      await adminService.deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
      enqueueSnackbar(MESSAGES.SUCCESS.PRODUCT_DELETED, { variant: 'success' })
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete product'
      enqueueSnackbar(message, { variant: 'error' })
      throw error
    }
  }, [enqueueSnackbar])

  // ==================== ORDERS ====================

  /**
   * Load all orders
   */
  const loadOrders = useCallback(async () => {
    setOrdersLoading(true)
    setOrdersError(null)
    try {
      const response = await adminService.getAllOrders()
      setOrders(response.data)
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load orders'
      setOrdersError(message)
      enqueueSnackbar(message, { variant: 'error' })
    } finally {
      setOrdersLoading(false)
    }
  }, [enqueueSnackbar])

  /**
   * Update order status
   * @param {number} id - Order ID
   * @param {string} status - New status
   */
  const updateOrderStatus = useCallback(async (id, status) => {
    try {
      const response = await adminService.updateOrderStatus(id, status)
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? response.data : o))
      )
      enqueueSnackbar(MESSAGES.SUCCESS.ORDER_STATUS_UPDATED, { variant: 'success' })
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update order status'
      enqueueSnackbar(message, { variant: 'error' })
      throw error
    }
  }, [enqueueSnackbar])

  // ==================== USERS ====================

  /**
   * Load all users
   */
  const loadUsers = useCallback(async () => {
    setUsersLoading(true)
    setUsersError(null)
    try {
      const response = await adminService.getAllUsers()
      setUsers(response.data)
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load users'
      setUsersError(message)
      enqueueSnackbar(message, { variant: 'error' })
    } finally {
      setUsersLoading(false)
    }
  }, [enqueueSnackbar])

  /**
   * Update user status (enable/disable)
   * @param {number} id - User ID
   * @param {boolean} isEnabled - Enable or disable
   */
  const updateUserStatus = useCallback(async (id, isEnabled) => {
    try {
      const response = await adminService.updateUserStatus(id, isEnabled)
      // Update user in state - use response data if available, otherwise update enabled field directly
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === id) {
            // If response contains full user object, use it; otherwise update enabled field
            return response.data?.id ? response.data : { ...u, isEnabled: isEnabled }
          }
          return u
        })
      )
      enqueueSnackbar(MESSAGES.SUCCESS.USER_STATUS_UPDATED, { variant: 'success' })
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update user status'
      enqueueSnackbar(message, { variant: 'error' })
      throw error
    }
  }, [enqueueSnackbar])

  /**
   * Register new admin
   * @param {Object} adminData - Admin data
   */
  const registerAdmin = useCallback(async (adminData) => {
    try {
      const response = await adminService.registerAdmin(adminData)
      await loadUsers()
      enqueueSnackbar('Admin registered successfully', { variant: 'success' })
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to register admin'
      enqueueSnackbar(message, { variant: 'error' })
      throw error
    }
  }, [enqueueSnackbar, loadUsers])

  // ==================== CATEGORIES ====================

  /**
   * Load categories for product form
   */
  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true)
    try {
      const response = await api.get(API_ENDPOINTS.CATEGORIES.BASE)
      setCategories(response.data)
    } catch (error) {
      // Fallback to mock categories if API fails
      setCategories([
        { id: 1, name: 'Electronics' },
        { id: 2, name: 'Clothing' },
        { id: 3, name: 'Books' },
        { id: 4, name: 'Home & Garden' },
        { id: 5, name: 'Sports' },
      ])
    } finally {
      setCategoriesLoading(false)
    }
  }, [])

  // ==================== STATS ====================

  /**
   * Get dashboard statistics
   * Calculated from loaded data
   */
  const getStats = useCallback(() => {
    // Total revenue from completed orders
    const totalRevenue = orders
      .filter((o) => o.status === 'DELIVERED')
      .reduce((sum, o) => sum + parseFloat(o.totalAmount || 0), 0)

    // Recent orders (last 5)
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)

    // Orders by status
    const ordersByStatus = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1
      return acc
    }, {})

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalUsers: users.length,
      totalRevenue,
      recentOrders,
      ordersByStatus,
      pendingOrders: ordersByStatus.PENDING || 0,
      activeUsers: users.filter((u) => u.isEnabled !== false).length,
    }
  }, [products, orders, users])

  /**
   * Load all data for dashboard
   */
  const loadDashboardData = useCallback(async () => {
    await Promise.all([loadProducts(), loadOrders(), loadUsers()])
  }, [loadProducts, loadOrders, loadUsers])

  return {
    // Products
    products,
    productsLoading,
    productsError,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,

    // Orders
    orders,
    ordersLoading,
    ordersError,
    loadOrders,
    updateOrderStatus,

    // Users
    users,
    usersLoading,
    usersError,
    loadUsers,
    updateUserStatus,
    registerAdmin,

    // Categories
    categories,
    categoriesLoading,
    loadCategories,

    // Stats
    getStats,
    loadDashboardData,
  }
}

export default useAdmin
