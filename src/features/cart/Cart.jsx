import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Divider,
  Paper,
  Grid,
  useMediaQuery,
  useTheme,
  Alert,
} from '@mui/material'
import { ShoppingCart, ArrowBack, ArrowForward, DeleteOutline } from '@mui/icons-material'
import { useCart } from '@hooks/useCart'
import CartItem from './CartItem'
import LoadingSkeleton from '@components/common/LoadingSkeleton'
import EmptyState from '@components/common/EmptyState'
import ConfirmDialog from '@components/common/ConfirmDialog'
import { formatCurrency } from '@utils/formatters'
import { ROUTES } from '@constants'

/**
 * Cart Page Component
 * Full-page shopping cart with items list and summary
 */
const Cart = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { items, totalAmount, loading, error, updateQuantity, removeItem, clearCart } = useCart()
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false)

  // Calculate cart summary
  const subtotal = totalAmount
  const tax = subtotal * 0.1 // 10% tax (adjust as needed)
  const shipping = subtotal > 50 ? 0 : 5.99 // Free shipping over $50
  const total = subtotal + tax + shipping

  const handleUpdateQuantity = (productId, quantity) => {
    updateQuantity(productId, quantity)
  }

  const handleRemoveItem = (productId) => {
    removeItem(productId)
  }

  const handleClearCart = () => {
    setClearConfirmOpen(true)
  }

  const confirmClearCart = () => {
    clearCart()
    setClearConfirmOpen(false)
  }

  const handleContinueShopping = () => {
    navigate(ROUTES.PRODUCTS)
  }

  const handleCheckout = () => {
    navigate(ROUTES.CHECKOUT)
  }

  // Loading state
  if (loading && items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LoadingSkeleton variant="product" count={3} />
      </Container>
    )
  }

  // Empty cart state
  if (!loading && items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <EmptyState
          variant="cart"
          title="Your cart is empty"
          message="Looks like you haven't added anything to your cart yet."
          action={
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleContinueShopping}
            >
              Start Shopping
            </Button>
          }
        />
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Shopping Cart
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          {/* Clear Cart Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteOutline />}
              onClick={handleClearCart}
              disabled={loading}
            >
              Clear Cart
            </Button>
          </Box>

          {/* Cart Items List */}
          <Box>
            {items.map((item) => (
              <CartItem
                key={item.productId}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
                loading={loading}
              />
            ))}
          </Box>

          {/* Continue Shopping Button (Mobile) */}
          {isMobile && (
            <Button
              variant="outlined"
              size="large"
              fullWidth
              startIcon={<ArrowBack />}
              onClick={handleContinueShopping}
              sx={{ mt: 2 }}
            >
              Continue Shopping
            </Button>
          )}
        </Grid>

        {/* Cart Summary */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              position: isMobile ? 'static' : 'sticky',
              top: isMobile ? 'auto' : 20,
              p: 3,
            }}
          >
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Order Summary
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Summary Details */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1">Subtotal</Typography>
                <Typography variant="body1" fontWeight={600}>
                  {formatCurrency(subtotal)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1">Tax (10%)</Typography>
                <Typography variant="body1" fontWeight={600}>
                  {formatCurrency(tax)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1">Shipping</Typography>
                <Typography variant="body1" fontWeight={600} color={shipping === 0 ? 'success.main' : 'inherit'}>
                  {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
                </Typography>
              </Box>

              {subtotal > 0 && subtotal < 50 && (
                <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
                  Add {formatCurrency(50 - subtotal)} more to get FREE shipping!
                </Alert>
              )}

              <Divider />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight={700}>
                  Total
                </Typography>
                <Typography variant="h6" fontWeight={700} color="primary">
                  {formatCurrency(total)}
                </Typography>
              </Box>
            </Box>

            {/* Checkout Button */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              endIcon={<ArrowForward />}
              onClick={handleCheckout}
              disabled={loading || items.length === 0}
              sx={{ mt: 3 }}
            >
              Proceed to Checkout
            </Button>

            {/* Continue Shopping Button (Desktop) */}
            {!isMobile && (
              <Button
                variant="outlined"
                size="large"
                fullWidth
                startIcon={<ArrowBack />}
                onClick={handleContinueShopping}
                sx={{ mt: 2 }}
              >
                Continue Shopping
              </Button>
            )}

            {/* Security Info */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                🔒 Secure checkout with 256-bit SSL encryption
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Clear Cart Confirmation Dialog */}
      <ConfirmDialog
        open={clearConfirmOpen}
        onClose={() => setClearConfirmOpen(false)}
        onConfirm={confirmClearCart}
        title="Clear Cart"
        message="Are you sure you want to remove all items from your cart? This action cannot be undone."
      />
    </Container>
  )
}

export default Cart
