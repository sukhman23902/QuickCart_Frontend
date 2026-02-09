import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Divider,
  Popover,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Close, ArrowForward } from '@mui/icons-material'
import { useCart } from '@hooks/useCart'
import CartItem from '@features/cart/CartItem'
import EmptyState from '@components/common/EmptyState'
import { formatCurrency } from '@utils/formatters'
import { ROUTES } from '@constants'

/**
 * MiniCart Component
 * Dropdown/drawer mini cart for header
 *
 * @param {Element} anchorEl - Anchor element for popover (desktop)
 * @param {Boolean} open - Open state
 * @param {Function} onClose - Close callback
 */
const MiniCart = ({ anchorEl, open, onClose }) => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { items, totalAmount, loading, updateQuantity, removeItem } = useCart()

  // Show max 5 items in mini cart
  const displayItems = items.slice(0, 5)
  const hasMore = items.length > 5

  const handleUpdateQuantity = (productId, quantity) => {
    updateQuantity(productId, quantity)
  }

  const handleRemoveItem = (productId) => {
    removeItem(productId)
  }

  const handleViewCart = () => {
    navigate(ROUTES.CART)
    onClose()
  }

  const handleCheckout = () => {
    navigate(ROUTES.CHECKOUT)
    onClose()
  }

  const handleContinueShopping = () => {
    navigate(ROUTES.PRODUCTS)
    onClose()
  }

  // Cart content
  const cartContent = (
    <Box
      sx={{
        width: isMobile ? '100%' : 400,
        maxHeight: isMobile ? '100%' : 600,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Shopping Cart ({items.length})
        </Typography>
        {isMobile && (
          <IconButton onClick={onClose} edge="end">
            <Close />
          </IconButton>
        )}
      </Box>

      {/* Empty State */}
      {items.length === 0 ? (
        <Box sx={{ p: 4 }}>
          <EmptyState
            variant="cart"
            title="Your cart is empty"
            message="Add items to get started"
            actionText="Start Shopping"
            onAction={handleContinueShopping}
          />
        </Box>
      ) : (
        <>
          {/* Cart Items */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
            }}
          >
            {displayItems.map((item) => (
              <CartItem
                key={item.productId}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
                loading={loading}
                compact
              />
            ))}

            {hasMore && (
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mt: 2 }}
              >
                + {items.length - 5} more {items.length - 5 === 1 ? 'item' : 'items'}
              </Typography>
            )}
          </Box>

          <Divider />

          {/* Total */}
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="body1" fontWeight={600}>
                Subtotal
              </Typography>
              <Typography variant="h6" fontWeight={700} color="primary">
                {formatCurrency(totalAmount)}
              </Typography>
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mb: 2 }}
            >
              Shipping and taxes calculated at checkout
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                endIcon={<ArrowForward />}
                onClick={handleCheckout}
                disabled={loading}
              >
                Checkout
              </Button>

              <Button
                variant="outlined"
                size="large"
                fullWidth
                onClick={handleViewCart}
              >
                View Cart
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  )

  // Mobile: Render as drawer
  if (isMobile) {
    return (
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: '100%',
            maxWidth: 400,
          },
        }}
      >
        {cartContent}
      </Drawer>
    )
  }

  // Desktop: Render as popover
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      sx={{
        mt: 1,
      }}
      slotProps={{
        paper: {
          elevation: 8,
          sx: {
            borderRadius: 2,
            overflow: 'hidden',
          },
        },
      }}
    >
      {cartContent}
    </Popover>
  )
}

MiniCart.propTypes = {
  anchorEl: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default MiniCart
