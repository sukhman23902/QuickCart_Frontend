/**
 * useCart Hook
 * Custom hook for shopping cart operations
 */

import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'
import {
  fetchCart,
  addToCartAsync,
  removeFromCartAsync,
  updateQuantityAsync,
  clearCartAsync,
  mergeCart,
  addItemLocal,
  removeItemLocal,
  updateQuantityLocal,
  clearCart as clearCartAction,
  selectCartItems,
  selectCartTotal,
  selectCartCount,
  selectCartLoading,
  selectCartError,
  clearError,
} from '@features/cart/cartSlice'
import { selectIsAuthenticated } from '@features/auth/authSlice'
import { MESSAGES } from '@constants'

export const useCart = () => {
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()

  const items = useSelector(selectCartItems)
  const totalAmount = useSelector(selectCartTotal)
  const itemCount = useSelector(selectCartCount)
  const loading = useSelector(selectCartLoading)
  const error = useSelector(selectCartError)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const loadCart = async () => {
    try {
      await dispatch(fetchCart()).unwrap()
    } catch (error) {
      enqueueSnackbar(MESSAGES.ERROR.FETCH_CART_FAILED, { variant: 'error' })
    }
  }

  const addItem = async (product, quantity = 1) => {
    try {
      if (isAuthenticated) {
        await dispatch(
          addToCartAsync({ productId: product.id, quantity })
        ).unwrap()
      } else {
        dispatch(
          addItemLocal({
            productId: product.id,
            productName: product.name,
            productPrice: product.price,
            productImageUrl: product.imageUrl,
            quantity,
          })
        )
      }
      enqueueSnackbar(MESSAGES.SUCCESS.ADD_TO_CART, { variant: 'success' })
    } catch (error) {
      enqueueSnackbar(error || MESSAGES.ERROR.GENERIC, { variant: 'error' })
    }
  }

  const removeItem = async (productId) => {
    try {
      if (isAuthenticated) {
        await dispatch(removeFromCartAsync(productId)).unwrap()
      } else {
        dispatch(removeItemLocal(productId))
      }
      enqueueSnackbar(MESSAGES.SUCCESS.REMOVE_FROM_CART, { variant: 'success' })
    } catch (error) {
      enqueueSnackbar(error || MESSAGES.ERROR.GENERIC, { variant: 'error' })
    }
  }

  const updateQuantity = async (productId, quantity) => {
    try {
      if (isAuthenticated) {
        await dispatch(updateQuantityAsync({ productId, quantity })).unwrap()
      } else {
        dispatch(updateQuantityLocal({ productId, quantity }))
      }
      enqueueSnackbar('Quantity updated', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar(error || MESSAGES.ERROR.GENERIC, { variant: 'error' })
    }
  }

  const mergeGuestCart = async (guestCartItems) => {
    try {
      if (guestCartItems && guestCartItems.length > 0) {
        await dispatch(mergeCart(guestCartItems)).unwrap()
        enqueueSnackbar('Cart merged successfully', { variant: 'success' })
      }
    } catch (error) {
      enqueueSnackbar(error || MESSAGES.ERROR.GENERIC, { variant: 'error' })
    }
  }

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await dispatch(clearCartAsync()).unwrap()
      } else {
        dispatch(clearCartAction())
      }
      enqueueSnackbar('Cart cleared successfully', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar(error || MESSAGES.ERROR.GENERIC, { variant: 'error' })
    }
  }

  const clearCartError = () => {
    dispatch(clearError())
  }

  return {
    items,
    totalAmount,
    itemCount,
    loading,
    error,
    loadCart,
    addItem,
    removeItem,
    updateQuantity,
    mergeGuestCart,
    clearCart,
    clearCartError,
  }
}

export default useCart
