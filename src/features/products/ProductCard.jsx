import { useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Box,
  Rating,
} from '@mui/material'
import { ShoppingCart, FavoriteBorder, Favorite } from '@mui/icons-material'
import { useAuth } from '@hooks/useAuth'
import { useCart } from '@hooks/useCart'
import Button from '@components/common/Button'
import { formatCurrency } from '@utils/formatters'
import { ROUTES } from '@constants'

/**
 * ProductCard Component
 * Displays a product card with image, name, price, and actions
 *
 * @param {Object} product - Product object
 * @param {Function} onAddToWishlist - Handler for wishlist toggle
 * @param {Boolean} isInWishlist - Whether product is in wishlist
 */
const ProductCard = ({ product, onAddToWishlist, isInWishlist = false }) => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { addItem } = useCart()
  const [addingToCart, setAddingToCart] = useState(false)

  const {
    id,
    name,
    price,
    imageUrl,
    stockQuantity = 0,
    rating = 0,
    reviewCount = 0,
  } = product

  const inStock = stockQuantity > 0

  const handleAddToCart = async (e) => {
    e.stopPropagation() // Prevent card click
    setAddingToCart(true)
    try {
      await addItem(product, 1)
    } finally {
      setAddingToCart(false)
    }
  }

  const handleWishlistToggle = (e) => {
    e.stopPropagation()
    if (onAddToWishlist) {
      onAddToWishlist(product)
    }
  }

  const handleCardClick = () => {
    navigate(`${ROUTES.PRODUCTS}/${id}`)
  }

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 6,
        },
      }}
      onClick={handleCardClick}
    >
      {/* Wishlist Icon */}
      {isAuthenticated && (
        <IconButton
          onClick={handleWishlistToggle}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'background.paper',
            zIndex: 1,
            '&:hover': {
              bgcolor: 'background.paper',
            },
          }}
          size="small"
        >
          {isInWishlist ? (
            <Favorite color="error" />
          ) : (
            <FavoriteBorder />
          )}
        </IconButton>
      )}

      {/* Stock Badge */}
      {!inStock && (
        <Chip
          label="Out of Stock"
          color="error"
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 1,
          }}
        />
      )}

      {/* Product Image */}
      <CardMedia
        component="img"
        height="240"
        image={imageUrl || 'https://via.placeholder.com/300x240?text=No+Image'}
        alt={name}
        sx={{
          objectFit: 'cover',
          bgcolor: 'grey.100',
        }}
      />

      {/* Product Info */}
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '3em',
          }}
        >
          {name}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Rating value={rating} precision={0.5} size="small" readOnly />
          <Typography variant="caption" color="text.secondary">
            ({reviewCount})
          </Typography>
        </Box>

        {/* Price */}
        <Typography
          variant="h6"
          color="primary"
          sx={{ fontWeight: 700, fontSize: '1.25rem' }}
        >
          {formatCurrency(price)}
        </Typography>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<ShoppingCart />}
          onClick={handleAddToCart}
          disabled={!inStock || addingToCart}
          loading={addingToCart}
          size="medium"
        >
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardActions>
    </Card>
  )
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    imageUrl: PropTypes.string,
    stockQuantity: PropTypes.number,
    rating: PropTypes.number,
    reviewCount: PropTypes.number,
  }).isRequired,
  onAddToWishlist: PropTypes.func,
  isInWishlist: PropTypes.bool,
}

export default ProductCard
