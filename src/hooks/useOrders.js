/**
 * useOrders Hook
 * Custom hook for orders operations
 */

import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'
import {
  fetchOrders,
  fetchOrderById,
  clearCurrentOrder,
  clearError,
  selectOrders,
  selectCurrentOrder,
  selectOrdersLoading,
  selectOrdersError,
} from '@features/orders/ordersSlice'
import { MESSAGES } from '@constants'

export const useOrders = () => {
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()

  const orders = useSelector(selectOrders)
  const currentOrder = useSelector(selectCurrentOrder)
  const loading = useSelector(selectOrdersLoading)
  const error = useSelector(selectOrdersError)

  const loadOrders = useCallback(async () => {
    try {
      await dispatch(fetchOrders()).unwrap()
    } catch (err) {
      enqueueSnackbar(err || MESSAGES.ERROR.FETCH_ORDERS_FAILED, {
        variant: 'error',
      })
    }
  }, [dispatch, enqueueSnackbar])

  const loadOrderById = useCallback(
    async (id) => {
      try {
        await dispatch(fetchOrderById(id)).unwrap()
      } catch (err) {
        enqueueSnackbar(err || MESSAGES.ERROR.FETCH_ORDERS_FAILED, {
          variant: 'error',
        })
      }
    },
    [dispatch, enqueueSnackbar]
  )

  const clearOrder = useCallback(() => {
    dispatch(clearCurrentOrder())
  }, [dispatch])

  const clearOrdersError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  const getOrdersByStatus = useCallback(
    (status) => {
      if (!status || status === 'ALL') {
        return orders
      }
      return orders.filter((order) => order.status === status)
    },
    [orders]
  )

  const orderCounts = useMemo(() => {
    const counts = {
      ALL: orders.length,
      PENDING: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    }

    orders.forEach((order) => {
      if (counts[order.status] !== undefined) {
        counts[order.status]++
      }
    })

    return counts
  }, [orders])

  return {
    orders,
    currentOrder,
    loading,
    error,
    loadOrders,
    loadOrderById,
    clearOrder,
    clearOrdersError,
    getOrdersByStatus,
    orderCounts,
  }
}

export default useOrders
