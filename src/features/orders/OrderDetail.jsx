import { useEffect } from 'react'
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  Divider,
  Breadcrumbs,
  Link,
  Skeleton,
  Alert,
  Stack,
} from '@mui/material'
import { ArrowBack, Home, LocalShipping } from '@mui/icons-material'
import { useOrders } from '@hooks/useOrders'
import OrderStatusBadge from './OrderStatusBadge'
import OrderTimeline from './OrderTimeline'
import Image from '@components/common/Image'
import { formatCurrency, formatDate } from '@utils/formatters'
import { ROUTES, DATE_FORMATS } from '@constants'

/**
 * Order detail skeleton for loading state
 */
const OrderDetailSkeleton = () => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    {/* Breadcrumbs skeleton */}
    <Skeleton variant="text" width={200} height={24} sx={{ mb: 2 }} />

    {/* Back button skeleton */}
    <Skeleton variant="rounded" width={140} height={36} sx={{ mb: 3 }} />

    {/* Header skeleton */}
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        mb: 4,
      }}
    >
      <Box>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="text" width={150} height={24} />
      </Box>
      <Skeleton variant="rounded" width={100} height={32} />
    </Box>

    {/* Timeline skeleton */}
    <Paper sx={{ p: 3, mb: 4 }}>
      <Skeleton variant="rectangular" height={100} />
    </Paper>

    {/* Content grid skeleton */}
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3 }}>
          <Skeleton variant="text" width={150} height={32} sx={{ mb: 2 }} />
          {[1, 2, 3].map((i) => (
            <Box
              key={i}
              sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}
            >
              <Skeleton variant="rounded" width={80} height={80} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="30%" height={20} />
              </Box>
              <Skeleton variant="text" width={80} height={24} />
            </Box>
          ))}
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3 }}>
          <Skeleton variant="text" width={150} height={32} sx={{ mb: 2 }} />
          {[1, 2, 3, 4].map((i) => (
            <Box
              key={i}
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}
            >
              <Skeleton variant="text" width={80} height={20} />
              <Skeleton variant="text" width={60} height={20} />
            </Box>
          ))}
        </Paper>
      </Grid>
    </Grid>
  </Container>
)

/**
 * OrderDetail Page Component
 * Displays detailed view of a single order
 */
const OrderDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentOrder, loading, error, loadOrderById, clearOrder } = useOrders()

  // Load order on mount
  useEffect(() => {
    if (id) {
      loadOrderById(id)
    }

    // Cleanup on unmount
    return () => {
      clearOrder()
    }
  }, [id, loadOrderById, clearOrder])

  const handleBackToOrders = () => {
    navigate(ROUTES.ORDERS)
  }

  // Loading state
  if (loading && !currentOrder) {
    return <OrderDetailSkeleton />
  }

  // Error state
  if (error && !currentOrder) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleBackToOrders}
        >
          Back to Orders
        </Button>
      </Container>
    )
  }

  // No order found
  if (!loading && !currentOrder) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Order not found
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleBackToOrders}
        >
          Back to Orders
        </Button>
      </Container>
    )
  }

  const {
    orderDate,
    status,
    totalAmount,
    items = [],
    shippingAddress,
  } = currentOrder

  // Calculate order summary
  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.subtotal || 0),
    0
  )
  const shipping = 0 // Free shipping - adjust as needed
  const tax = subtotal * 0.1 // 10% tax - adjust as needed
  const total = parseFloat(totalAmount)

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          component={RouterLink}
          to={ROUTES.PRODUCTS}
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
            textDecoration: 'none',
            '&:hover': { color: 'primary.main' },
          }}
        >
          <Home sx={{ mr: 0.5, fontSize: 18 }} />
          Home
        </Link>
        <Link
          component={RouterLink}
          to={ROUTES.ORDERS}
          sx={{
            color: 'text.secondary',
            textDecoration: 'none',
            '&:hover': { color: 'primary.main' },
          }}
        >
          Orders
        </Link>
        <Typography color="text.primary">Order #{id}</Typography>
      </Breadcrumbs>

      {/* Back Button */}
      <Button
        variant="text"
        startIcon={<ArrowBack />}
        onClick={handleBackToOrders}
        sx={{ mb: 3 }}
      >
        Back to Orders
      </Button>

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
            Order #{id}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Placed on {formatDate(orderDate, DATE_FORMATS.FULL)}
          </Typography>
        </Box>
        <OrderStatusBadge status={status} size="medium" />
      </Box>

      {/* Order Timeline */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <OrderTimeline currentStatus={status} orderDate={orderDate} />
      </Paper>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Left Column: Order Items */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Order Items ({items.length})
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
              {items.map((item, index) => (
                <Card
                  key={item.id || index}
                  variant="outlined"
                  sx={{ bgcolor: 'background.default' }}
                >
                  <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Image
                        src={item.productImageUrl}
                        alt={item.productName}
                        width={80}
                        height={80}
                        borderRadius={1}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle1" fontWeight={600} noWrap>
                          {item.productName}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          Unit Price: {formatCurrency(item.priceAtPurchase || item.productPrice)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Quantity: {item.quantity}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {formatCurrency(item.subtotal)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Right Column: Summary & Shipping */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Order Summary */}
            <Paper sx={{ p: 3, position: { md: 'sticky' }, top: { md: 24 } }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Subtotal
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrency(subtotal)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Shipping
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Tax
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrency(tax)}
                  </Typography>
                </Box>

                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Total
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={700} color="primary.main">
                    {formatCurrency(total)}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Shipping Address */}
            {shippingAddress && (
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <LocalShipping color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Shipping Address
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />

                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {typeof shippingAddress === 'string'
                    ? shippingAddress
                    : `${shippingAddress.street || ''}
${shippingAddress.city || ''}, ${shippingAddress.state || ''} ${shippingAddress.zipCode || ''}
${shippingAddress.country || ''}`}
                </Typography>
              </Paper>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  )
}

export default OrderDetail
