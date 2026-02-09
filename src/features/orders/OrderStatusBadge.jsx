import PropTypes from 'prop-types'
import { Chip } from '@mui/material'
import {
  HourglassEmpty,
  LocalShipping,
  CheckCircle,
  Cancel,
} from '@mui/icons-material'
import {
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
} from '@constants'

/**
 * OrderStatusBadge Component
 * Displays order status as a colored chip with icon
 *
 * @param {string} status - Order status (PENDING, SHIPPED, DELIVERED, CANCELLED)
 * @param {string} size - Chip size ('small' | 'medium')
 */
const OrderStatusBadge = ({ status, size = 'small' }) => {
  const getIcon = () => {
    const iconProps = { fontSize: size === 'small' ? 'small' : 'medium' }

    switch (status) {
      case ORDER_STATUS.PENDING:
        return <HourglassEmpty {...iconProps} />
      case ORDER_STATUS.SHIPPED:
        return <LocalShipping {...iconProps} />
      case ORDER_STATUS.DELIVERED:
        return <CheckCircle {...iconProps} />
      case ORDER_STATUS.CANCELLED:
        return <Cancel {...iconProps} />
      default:
        return <HourglassEmpty {...iconProps} />
    }
  }

  const label = ORDER_STATUS_LABELS[status] || status
  const color = ORDER_STATUS_COLORS[status] || 'default'

  return (
    <Chip
      icon={getIcon()}
      label={label}
      color={color}
      size={size}
      variant="filled"
      sx={{
        fontWeight: 600,
        '& .MuiChip-icon': {
          color: 'inherit',
        },
      }}
    />
  )
}

OrderStatusBadge.propTypes = {
  status: PropTypes.oneOf(Object.values(ORDER_STATUS)).isRequired,
  size: PropTypes.oneOf(['small', 'medium']),
}

export default OrderStatusBadge
