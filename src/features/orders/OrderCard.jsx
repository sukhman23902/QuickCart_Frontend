import PropTypes from 'prop-types'
import {
  Card,
  CardContent,
  CardActionArea,
  Box,
  Typography,
  Divider,
  Stack,
} from '@mui/material'
import { ChevronRight } from '@mui/icons-material'
import OrderStatusBadge from './OrderStatusBadge'
import Image from '@components/common/Image'
import { formatCurrency, formatDate } from '@utils/formatters'
import { DATE_FORMATS } from '@constants'

/**
 * OrderCard Component
 * Displays an order summary card for order history list
 *
 * @param {Object} order - Order object
 * @param {Function} onClick - Click handler for navigation
 */
const OrderCard = ({ order, onClick }) => {
  const { id, orderDate, status, totalAmount, items = [] } = order

  // Show first 2 items, then indicate remaining count
  const visibleItems = items.slice(0, 2)
  const remainingCount = items.length - 2

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      <CardActionArea onClick={onClick} sx={{ flexGrow: 1 }}>
        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header: Order ID and Status */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 1,
            }}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                Order #{id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDate(orderDate, DATE_FORMATS.SHORT)}
              </Typography>
            </Box>
            <OrderStatusBadge status={status} size="small" />
          </Box>

          <Divider sx={{ my: 1.5 }} />

          {/* Order Items Preview */}
          <Box sx={{ flexGrow: 1 }}>
            <Stack spacing={1.5}>
              {visibleItems.map((item, index) => (
                <Box
                  key={item.id || index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <Image
                    src={item.productImageUrl}
                    alt={item.productName}
                    width={48}
                    height={48}
                    borderRadius={1}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      noWrap
                      title={item.productName}
                    >
                      {item.productName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      x{item.quantity}
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={500}>
                    {formatCurrency(item.subtotal)}
                  </Typography>
                </Box>
              ))}
            </Stack>

            {remainingCount > 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1.5, fontStyle: 'italic' }}
              >
                +{remainingCount} more {remainingCount === 1 ? 'item' : 'items'}...
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 1.5 }} />

          {/* Footer: Total and View Details */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary">
                Total
              </Typography>
              <Typography variant="subtitle1" fontWeight={700}>
                {formatCurrency(totalAmount)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'primary.main',
              }}
            >
              <Typography variant="body2" fontWeight={600}>
                View Details
              </Typography>
              <ChevronRight fontSize="small" />
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

OrderCard.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    orderDate: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    totalAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        productName: PropTypes.string,
        productImageUrl: PropTypes.string,
        quantity: PropTypes.number,
        subtotal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      })
    ),
  }).isRequired,
  onClick: PropTypes.func.isRequired,
}

export default OrderCard
