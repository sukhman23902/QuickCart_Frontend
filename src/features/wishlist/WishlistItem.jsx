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
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Delete, ShoppingCart } from '@mui/icons-material'
import { formatCurrency, formatRelativeTime } from '@utils/formatters'
import ConfirmDialog from '@components/common/ConfirmDialog'
import Image from '@components/common/Image'
import { ROUTES } from '@constants'

/**
 * WishlistItem Component
 * Displays individual wishlist item with move to cart and remove options
 *
 * @param {Object} item - Wishlist item object
 * @param {Function} onMoveToCart - Callback for moving item to cart
 * @param {Function} onRemove - Callback for item removal
 * @param {Boolean} loading - Loading state
 */
const WishlistItem = ({ item, onMoveToCart, onRemove, loading = false }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [confirmOpen, setConfirmOpen] = useState(false)

  const productId = item.productId || item.id
  const isOutOfStock = item.stockQuantity === 0

  const handleRemove = () => {
    setConfirmOpen(true)
  }

  const confirmRemove = () => {
    onRemove(productId)
    setConfirmOpen(false)
  }

  const handleMoveToCart = () => {
    onMoveToCart(productId)
  }

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            boxShadow: theme.shadows[4],
          },
          transition: 'box-shadow 0.3s ease',
        }}
      >
        {/* Product Image */}
        <Link
          to={`${ROUTES.PRODUCTS}/${productId}`}
          style={{ textDecoration: 'none' }}
        >
          <Box sx={{ position: 'relative' }}>
            <Image
              src={item.productImageUrl}
              alt={item.productName}
              sx={{
                width: '100%',
                height: 200,
                objectFit: 'cover',
              }}
            />
            {/* Stock Status Badge */}
            <Chip
              label={isOutOfStock ? 'Out of Stock' : 'In Stock'}
              color={isOutOfStock ? 'error' : 'success'}
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                fontWeight: 600,
              }}
            />
          </Box>
        </Link>

        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Product Name */}
          <Link
            to={`${ROUTES.PRODUCTS}/${productId}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                minHeight: '3.6em',
                '&:hover': { color: 'primary.main' },
                transition: 'color 0.2s ease',
              }}
            >
              {item.productName}
            </Typography>
          </Link>

          {/* Price */}
          <Typography
            variant="h5"
            color="primary"
            fontWeight={700}
            sx={{ mt: 1 }}
          >
            {formatCurrency(item.productPrice)}
          </Typography>

          {/* Added Date */}
          {item.addedAt && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Added {formatRelativeTime(item.addedAt)}
            </Typography>
          )}

          {/* Spacer */}
          <Box sx={{ flex: 1 }} />

          {/* Actions */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 1,
              mt: 2,
            }}
          >
            {/* Move to Cart Button */}
            <Button
              variant="contained"
              color="primary"
              startIcon={<ShoppingCart />}
              onClick={handleMoveToCart}
              disabled={loading || isOutOfStock}
              fullWidth
              sx={{ flex: 1 }}
            >
              {isOutOfStock ? 'Out of Stock' : 'Move to Cart'}
            </Button>

            {/* Remove Button */}
            <IconButton
              color="error"
              onClick={handleRemove}
              disabled={loading}
              sx={{
                border: `1px solid ${theme.palette.error.main}`,
                borderRadius: 1,
              }}
            >
              <Delete />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmRemove}
        title="Remove from Wishlist"
        message={`Are you sure you want to remove "${item.productName}" from your wishlist?`}
      />
    </>
  )
}

WishlistItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number,
    productId: PropTypes.number,
    productName: PropTypes.string.isRequired,
    productPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    productImageUrl: PropTypes.string,
    stockQuantity: PropTypes.number,
    addedAt: PropTypes.string,
  }).isRequired,
  onMoveToCart: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  loading: PropTypes.bool,
}

export default WishlistItem
