import { useState } from 'react'
import PropTypes from 'prop-types'
import {
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Box,
} from '@mui/material'
import ConfirmDialog from '@components/common/ConfirmDialog'
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '@constants'

/**
 * OrderStatusSelect Component
 * Dropdown for updating order status with confirmation for cancellation
 *
 * @param {string} status - Current order status
 * @param {number} orderId - Order ID
 * @param {Function} onUpdate - Update handler (id, newStatus) => Promise
 * @param {boolean} disabled - Disable the select
 */
const OrderStatusSelect = ({
  status,
  orderId,
  onUpdate,
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingStatus, setPendingStatus] = useState(null)

  const statusOptions = [
    { value: ORDER_STATUS.PENDING, label: ORDER_STATUS_LABELS.PENDING },
    { value: ORDER_STATUS.SHIPPED, label: ORDER_STATUS_LABELS.SHIPPED },
    { value: ORDER_STATUS.DELIVERED, label: ORDER_STATUS_LABELS.DELIVERED },
    { value: ORDER_STATUS.CANCELLED, label: ORDER_STATUS_LABELS.CANCELLED },
  ]

  // Get color for status chip styling
  const getStatusColor = (statusValue) => {
    const colors = {
      [ORDER_STATUS.PENDING]: { bg: '#fff3e0', text: '#e65100' },
      [ORDER_STATUS.SHIPPED]: { bg: '#e3f2fd', text: '#1565c0' },
      [ORDER_STATUS.DELIVERED]: { bg: '#e8f5e9', text: '#2e7d32' },
      [ORDER_STATUS.CANCELLED]: { bg: '#ffebee', text: '#c62828' },
    }
    return colors[statusValue] || { bg: '#f5f5f5', text: '#757575' }
  }

  const handleChange = async (event) => {
    const newStatus = event.target.value
    if (newStatus === status) return

    // Show confirmation for cancellation
    if (newStatus === ORDER_STATUS.CANCELLED) {
      setPendingStatus(newStatus)
      setConfirmOpen(true)
      return
    }

    await performUpdate(newStatus)
  }

  const performUpdate = async (newStatus) => {
    setLoading(true)
    try {
      await onUpdate(orderId, newStatus)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmCancel = async () => {
    setConfirmOpen(false)
    if (pendingStatus) {
      await performUpdate(pendingStatus)
      setPendingStatus(null)
    }
  }

  const handleCancelDialog = () => {
    setConfirmOpen(false)
    setPendingStatus(null)
  }

  const currentColor = getStatusColor(status)

  return (
    <>
      <FormControl size="small" sx={{ minWidth: 130 }}>
        <Select
          value={status}
          onChange={handleChange}
          disabled={disabled || loading}
          sx={{
            backgroundColor: currentColor.bg,
            color: currentColor.text,
            fontWeight: 600,
            fontSize: '0.875rem',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: currentColor.text,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: currentColor.text,
            },
          }}
          renderValue={(value) => (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {loading && <CircularProgress size={16} />}
              {ORDER_STATUS_LABELS[value] || value}
            </Box>
          )}
        >
          {statusOptions.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{
                fontWeight: option.value === status ? 600 : 400,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: getStatusColor(option.value).text,
                  mr: 1,
                }}
              />
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Confirmation Dialog for Cancellation */}
      <ConfirmDialog
        open={confirmOpen}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This action cannot be undone and the customer will be notified."
        confirmText="Cancel Order"
        confirmColor="error"
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelDialog}
      />
    </>
  )
}

OrderStatusSelect.propTypes = {
  status: PropTypes.oneOf(Object.values(ORDER_STATUS)).isRequired,
  orderId: PropTypes.number.isRequired,
  onUpdate: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
}

export default OrderStatusSelect
