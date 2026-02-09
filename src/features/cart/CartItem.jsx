import { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Add, Remove, Delete } from '@mui/icons-material'
import { formatCurrency } from '@utils/formatters'
import ConfirmDialog from '@components/common/ConfirmDialog'
import Image from '@components/common/Image'
import { ROUTES } from '@constants'

/**
 * CartItem Component
 * Displays individual cart item with quantity controls and remove option
 *
 * @param {Object} item - Cart item object
 * @param {Function} onUpdateQuantity - Callback for quantity update
 * @param {Function} onRemove - Callback for item removal
 * @param {Boolean} loading - Loading state
 * @param {Boolean} compact - Compact view for mini cart
 */
const CartItem = ({ item, onUpdateQuantity, onRemove, loading = false, compact = false }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [quantity, setQuantity] = useState(item.quantity)

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return
    if (item.productStockQuantity && newQuantity > item.productStockQuantity) {
      // Show stock limit message
      return
    }
    setQuantity(newQuantity)
    onUpdateQuantity(item.productId, newQuantity)
  }

  const handleIncrement = () => {
    handleQuantityChange(quantity + 1)
  }

  const handleDecrement = () => {
    handleQuantityChange(quantity - 1)
  }

  const handleRemove = () => {
    setConfirmOpen(true)
  }

  const confirmRemove = () => {
    onRemove(item.productId)
    setConfirmOpen(false)
  }

  // Compact view for mini cart
  if (compact) {
    return (
      <>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            py: 1.5,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          {/* Product Image */}
          <Link to={`${ROUTES.PRODUCTS}/${item.productId}`} style={{ textDecoration: 'none' }}>
            <Image
              src={item.productImageUrl}
              alt={item.productName}
              sx={{
                width: 60,
                height: 60,
                borderRadius: 1,
                objectFit: 'cover',
              }}
            />
          </Link>

          {/* Product Details */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Link
              to={`${ROUTES.PRODUCTS}/${item.productId}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {item.productName}
              </Typography>
            </Link>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {quantity} × {formatCurrency(item.productPrice)}
            </Typography>

            <Typography variant="body2" fontWeight={700} color="primary" sx={{ mt: 0.5 }}>
              {formatCurrency(item.subtotal)}
            </Typography>
          </Box>

          {/* Remove Button */}
          <IconButton
            size="small"
            onClick={handleRemove}
            disabled={loading}
            sx={{ alignSelf: 'flex-start' }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>

        <ConfirmDialog
          open={confirmOpen}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={confirmRemove}
          title="Remove Item"
          message={`Are you sure you want to remove "${item.productName}" from your cart?`}
        />
      </>
    )
  }

  // Full view for cart page
  return (
    <>
      <Card
        sx={{
          mb: 2,
          '&:hover': {
            boxShadow: theme.shadows[4],
          },
          transition: 'box-shadow 0.3s ease',
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 3,
            }}
          >
            {/* Product Image */}
            <Link to={`${ROUTES.PRODUCTS}/${item.productId}`} style={{ textDecoration: 'none' }}>
              <Image
                src={item.productImageUrl}
                alt={item.productName}
                sx={{
                  width: isMobile ? '100%' : 120,
                  height: isMobile ? 200 : 120,
                  borderRadius: 2,
                  objectFit: 'cover',
                }}
              />
            </Link>

            {/* Product Details */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                to={`${ROUTES.PRODUCTS}/${item.productId}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    '&:hover': { color: 'primary.main' },
                    transition: 'color 0.2s ease',
                  }}
                >
                  {item.productName}
                </Typography>
              </Link>

              <Typography variant="h6" color="primary" fontWeight={700}>
                {formatCurrency(item.productPrice)}
              </Typography>

              {/* Stock Status */}
              {item.productStockQuantity !== undefined && (
                <Typography
                  variant="body2"
                  color={item.productStockQuantity > 0 ? 'success.main' : 'error.main'}
                >
                  {item.productStockQuantity > 0
                    ? `${item.productStockQuantity} in stock`
                    : 'Out of stock'}
                </Typography>
              )}
            </Box>

            {/* Quantity Controls & Subtotal */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'row' : 'column',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'center' : 'flex-end',
                gap: 2,
              }}
            >
              {/* Quantity Selector */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  size="small"
                  onClick={handleDecrement}
                  disabled={loading || quantity <= 1}
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Remove fontSize="small" />
                </IconButton>

                <TextField
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1
                    handleQuantityChange(val)
                  }}
                  disabled={loading}
                  size="small"
                  sx={{
                    width: 60,
                    '& input': {
                      textAlign: 'center',
                      fontWeight: 600,
                    },
                  }}
                  inputProps={{
                    min: 1,
                    max: item.productStockQuantity || 999,
                  }}
                />

                <IconButton
                  size="small"
                  onClick={handleIncrement}
                  disabled={
                    loading ||
                    (item.productStockQuantity && quantity >= item.productStockQuantity)
                  }
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Add fontSize="small" />
                </IconButton>
              </Box>

              {/* Subtotal */}
              <Typography variant="h6" fontWeight={700} color="primary">
                {formatCurrency(item.subtotal)}
              </Typography>

              {/* Remove Button */}
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<Delete />}
                onClick={handleRemove}
                disabled={loading}
                fullWidth={isMobile}
              >
                Remove
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmRemove}
        title="Remove Item"
        message={`Are you sure you want to remove "${item.productName}" from your cart?`}
      />
    </>
  )
}

CartItem.propTypes = {
  item: PropTypes.shape({
    productId: PropTypes.number.isRequired,
    productName: PropTypes.string.isRequired,
    productPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    productImageUrl: PropTypes.string,
    productStockQuantity: PropTypes.number,
    quantity: PropTypes.number.isRequired,
    subtotal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  compact: PropTypes.bool,
}

export default CartItem
