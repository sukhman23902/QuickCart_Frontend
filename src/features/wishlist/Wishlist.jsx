import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Alert,
} from '@mui/material'
import { FavoriteBorder, ArrowBack, DeleteOutline } from '@mui/icons-material'
import { useWishlist } from './useWishlist'
import WishlistItem from './WishlistItem'
import LoadingSkeleton from '@components/common/LoadingSkeleton'
import EmptyState from '@components/common/EmptyState'
import ConfirmDialog from '@components/common/ConfirmDialog'
import { ROUTES } from '@constants'

/**
 * Wishlist Page Component
 * Displays user's wishlist with move to cart and remove options
 */
const Wishlist = () => {
  const navigate = useNavigate()
  const {
    items,
    itemCount,
    loading,
    error,
    loadWishlist,
    moveToCart,
    removeItem,
    clearAllItems,
  } = useWishlist()
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false)

  // Load wishlist on mount
  useEffect(() => {
    loadWishlist()
  }, [loadWishlist])

  const handleMoveToCart = (productId) => {
    moveToCart(productId)
  }

  const handleRemoveItem = (productId) => {
    removeItem(productId)
  }

  const handleClearWishlist = () => {
    setClearConfirmOpen(true)
  }

  const confirmClearWishlist = () => {
    clearAllItems()
    setClearConfirmOpen(false)
  }

  const handleContinueShopping = () => {
    navigate(ROUTES.PRODUCTS)
  }

  // Loading state
  if (loading && items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            My Wishlist
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <LoadingSkeleton variant="product" />
            </Grid>
          ))}
        </Grid>
      </Container>
    )
  }

  // Empty wishlist state
  if (!loading && items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <EmptyState
          variant="wishlist"
          title="Your wishlist is empty"
          message="Save your favorite items to purchase them later."
          action={
            <Button
              variant="contained"
              size="large"
              startIcon={<FavoriteBorder />}
              onClick={handleContinueShopping}
            >
              Browse Products
            </Button>
          }
        />
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            My Wishlist
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} saved
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleContinueShopping}
          >
            Continue Shopping
          </Button>
          {items.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteOutline />}
              onClick={handleClearWishlist}
              disabled={loading}
            >
              Clear All
            </Button>
          )}
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Wishlist Items Grid */}
      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={item.productId || item.id}
          >
            <WishlistItem
              item={item}
              onMoveToCart={handleMoveToCart}
              onRemove={handleRemoveItem}
              loading={loading}
            />
          </Grid>
        ))}
      </Grid>

      {/* Clear Wishlist Confirmation Dialog */}
      <ConfirmDialog
        open={clearConfirmOpen}
        onClose={() => setClearConfirmOpen(false)}
        onConfirm={confirmClearWishlist}
        title="Clear Wishlist"
        message="Are you sure you want to remove all items from your wishlist? This action cannot be undone."
      />
    </Container>
  )
}

export default Wishlist
