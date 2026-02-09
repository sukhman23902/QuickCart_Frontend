/**
 * useWishlist Hook
 * Custom hook for wishlist operations
 */

import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist as clearWishlistAction,
  selectWishlist,
  selectWishlistLoading,
  selectWishlistError,
  clearError,
} from './wishlistSlice'
import { addToCartAsync } from '@features/cart/cartSlice'
import { selectIsAuthenticated } from '@features/auth/authSlice'
import { MESSAGES, ROUTES } from '@constants'

/**
 * useWishlist Hook
 * @returns {Object} Wishlist state and methods
 */
export const useWishlist = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const items = useSelector(selectWishlist)
  const loading = useSelector(selectWishlistLoading)
  const error = useSelector(selectWishlistError)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  // Item count for badge
  const itemCount = items?.length || 0

  const loadWishlist = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      await dispatch(fetchWishlist()).unwrap()
    } catch (error) {
      enqueueSnackbar('Failed to load wishlist', { variant: 'error' })
    }
  }, [dispatch, isAuthenticated, enqueueSnackbar])

  const addItem = useCallback(async (productId) => {
    if (!isAuthenticated) {
      enqueueSnackbar('Please login to add items to wishlist', { variant: 'info' })
      navigate(ROUTES.LOGIN)
      return
    }
    try {
      await dispatch(addToWishlist(productId)).unwrap()
      enqueueSnackbar(MESSAGES.SUCCESS.ADD_TO_WISHLIST, { variant: 'success' })
    } catch (error) {
      enqueueSnackbar(error || MESSAGES.ERROR.GENERIC, { variant: 'error' })
    }
  }, [dispatch, isAuthenticated, navigate, enqueueSnackbar])

  const removeItem = useCallback(async (productId) => {
    try {
      await dispatch(removeFromWishlist(productId)).unwrap()
      enqueueSnackbar(MESSAGES.SUCCESS.REMOVE_FROM_WISHLIST, { variant: 'success' })
    } catch (error) {
      enqueueSnackbar(error || MESSAGES.ERROR.GENERIC, { variant: 'error' })
    }
  }, [dispatch, enqueueSnackbar])

  const toggleItem = useCallback(async (productId) => {
    if (!isAuthenticated) {
      enqueueSnackbar('Please login to manage wishlist', { variant: 'info' })
      navigate(ROUTES.LOGIN)
      return
    }

    const inWishlist = items.some(
      (item) => item.id === productId || item.productId === productId
    )

    if (inWishlist) {
      await removeItem(productId)
    } else {
      await addItem(productId)
    }
  }, [isAuthenticated, items, addItem, removeItem, navigate, enqueueSnackbar])

  const moveToCart = useCallback(async (productId, quantity = 1) => {
    try {
      // Add to cart first
      await dispatch(addToCartAsync({ productId, quantity })).unwrap()
      // Then remove from wishlist
      await dispatch(removeFromWishlist(productId)).unwrap()
      enqueueSnackbar('Item moved to cart', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar(error || MESSAGES.ERROR.GENERIC, { variant: 'error' })
    }
  }, [dispatch, enqueueSnackbar])

  const clearAllItems = useCallback(async () => {
    try {
      // Remove each item one by one since there's no bulk delete API
      for (const item of items) {
        const productId = item.productId || item.id
        await dispatch(removeFromWishlist(productId)).unwrap()
      }
      dispatch(clearWishlistAction())
      enqueueSnackbar('Wishlist cleared', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar(error || MESSAGES.ERROR.GENERIC, { variant: 'error' })
    }
  }, [dispatch, items, enqueueSnackbar])

  const isInWishlist = useCallback((productId) => {
    return items.some(
      (item) => item.id === productId || item.productId === productId
    )
  }, [items])

  const clearWishlistError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return {
    items,
    itemCount,
    loading,
    error,
    isAuthenticated,
    loadWishlist,
    addItem,
    removeItem,
    toggleItem,
    moveToCart,
    clearAllItems,
    isInWishlist,
    clearWishlistError,
  }
}

export default useWishlist
