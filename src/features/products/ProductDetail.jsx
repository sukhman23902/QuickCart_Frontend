import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Link,
  Chip,
  Rating,
  TextField,
  Divider,
  Alert,
} from '@mui/material'
import {
  ShoppingCart,
  FavoriteBorder,
  Favorite,
  Add,
  Remove,
  ChevronRight,
} from '@mui/icons-material'
import { fetchProductById } from '@features/products/productsSlice'
import {
  addToWishlist as addToWishlistAction,
  removeFromWishlist as removeFromWishlistAction,
} from '@features/wishlist/wishlistSlice'
import { useAuth } from '@hooks/useAuth'
import { useCart } from '@hooks/useCart'
import LoadingSpinner from '@components/common/LoadingSpinner'
import { formatCurrency } from '@utils/formatters'
import { ROUTES } from '@constants'

/**
 * ProductDetail Page
 * Displays detailed product information with add to cart and wishlist
 */
const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated } = useAuth()
  const { addItem } = useCart()

  const { selectedProduct: product, loading, error } = useSelector((state) => state.products)
  const { items: wishlistItems } = useSelector((state) => state.wishlist)

  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    dispatch(fetchProductById(id))
  }, [dispatch, id])

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading product..." />
  }

  if (error) {
    return (
      <Box sx={{ width: '100%', px: 4, py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate(ROUTES.PRODUCTS)}>
          Back to Products
        </Button>
      </Box>
    )
  }

  if (!product) {
    return (
      <Box sx={{ width: '100%', px: 4, py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Product not found
        </Alert>
        <Button variant="outlined" onClick={() => navigate(ROUTES.PRODUCTS)}>
          Back to Products
        </Button>
      </Box>
    )
  }

  const {
    name,
    price,
    description,
    imageUrl,
    stockQuantity = 0,
    rating = 0,
    reviewCount = 0,
    categoryName,
  } = product

  const inStock = stockQuantity > 0
  const maxQuantity = Math.min(stockQuantity, 10)

  const isInWishlist = wishlistItems.some((item) => item.id === product.id)

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity)
    }
  }

  const handleQuantityInput = (e) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value >= 1 && value <= maxQuantity) {
      setQuantity(value)
    }
  }

  const handleAddToCart = async () => {
    setAddingToCart(true)
    try {
      await addItem(product, quantity)
      // Optionally reset quantity or show success message
    } finally {
      setAddingToCart(false)
    }
  }

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN)
      return
    }

    if (isInWishlist) {
      dispatch(removeFromWishlistAction(product.id))
    } else {
      dispatch(addToWishlistAction(product))
    }
  }

  return (
    <Box sx={{ width: '100%', px: 4, py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<ChevronRight fontSize="small" />}
        sx={{ mb: 4 }}
      >
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate(ROUTES.PRODUCTS)}
          sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
        >
          Products
        </Link>
        {categoryName && (
          <Typography variant="body2" color="text.secondary">
            {categoryName}
          </Typography>
        )}
        <Typography variant="body2" color="text.primary">
          {name}
        </Typography>
      </Breadcrumbs>

      {/* Product Detail */}
      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={imageUrl || 'https://via.placeholder.com/600x600?text=No+Image'}
            alt={name}
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: 600,
              objectFit: 'cover',
              borderRadius: 2,
              bgcolor: 'grey.100',
            }}
          />
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box>
            {/* Title */}
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {name}
            </Typography>

            {/* Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Rating value={rating} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary">
                ({reviewCount} reviews)
              </Typography>
            </Box>

            {/* Price */}
            <Typography
              variant="h3"
              color="primary"
              fontWeight={700}
              gutterBottom
              sx={{ mb: 2 }}
            >
              {formatCurrency(price)}
            </Typography>

            {/* Stock Status */}
            <Box sx={{ mb: 3 }}>
              {inStock ? (
                <Chip label={`In Stock (${stockQuantity} available)`} color="success" />
              ) : (
                <Chip label="Out of Stock" color="error" />
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Description */}
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {description || 'No description available for this product.'}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Quantity Selector */}
            {inStock && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Quantity
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <IconButton
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      size="small"
                    >
                      <Remove />
                    </IconButton>
                    <TextField
                      value={quantity}
                      onChange={handleQuantityInput}
                      inputProps={{
                        style: { textAlign: 'center', width: 60 },
                        min: 1,
                        max: maxQuantity,
                      }}
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                    />
                    <IconButton
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= maxQuantity}
                      size="small"
                    >
                      <Add />
                    </IconButton>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Max: {maxQuantity}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={!inStock || addingToCart}
                sx={{ py: 1.5 }}
              >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </Button>
              <IconButton
                onClick={handleWishlistToggle}
                size="large"
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                }}
              >
                {isInWishlist ? (
                  <Favorite color="error" />
                ) : (
                  <FavoriteBorder />
                )}
              </IconButton>
            </Box>

            {/* Category */}
            {categoryName && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Category: <strong>{categoryName}</strong>
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>

    </Box>
  )
}

export default ProductDetail
