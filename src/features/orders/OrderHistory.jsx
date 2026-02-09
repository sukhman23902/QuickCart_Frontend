import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Grid,
  Alert,
  Skeleton,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useOrders } from '@hooks/useOrders'
import OrderCard from './OrderCard'
import EmptyState from '@components/common/EmptyState'
import { ROUTES, ORDER_STATUS, ORDER_STATUS_LABELS } from '@constants'

/**
 * Order list skeleton for loading state
 */
const OrderListSkeleton = () => (
  <Grid container spacing={3}>
    {[1, 2, 3].map((i) => (
      <Grid item xs={12} sm={6} md={4} key={i}>
        <Card>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 2,
              }}
            >
              <Box>
                <Skeleton variant="text" width={100} height={28} />
                <Skeleton variant="text" width={80} height={20} />
              </Box>
              <Skeleton variant="rounded" width={80} height={24} />
            </Box>
            <Skeleton variant="rectangular" height={1} sx={{ my: 1.5 }} />
            {[1, 2].map((j) => (
              <Box
                key={j}
                sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: 1.5 }}
              >
                <Skeleton variant="rounded" width={48} height={48} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="70%" height={20} />
                  <Skeleton variant="text" width="30%" height={16} />
                </Box>
                <Skeleton variant="text" width={60} height={20} />
              </Box>
            ))}
            <Skeleton variant="rectangular" height={1} sx={{ my: 1.5 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Skeleton variant="text" width={40} height={16} />
                <Skeleton variant="text" width={80} height={24} />
              </Box>
              <Skeleton variant="text" width={100} height={24} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
)

/**
 * Tab statuses configuration
 */
const TAB_STATUSES = [
  { value: 'ALL', label: 'All Orders' },
  { value: ORDER_STATUS.PENDING, label: ORDER_STATUS_LABELS[ORDER_STATUS.PENDING] },
  { value: ORDER_STATUS.SHIPPED, label: ORDER_STATUS_LABELS[ORDER_STATUS.SHIPPED] },
  { value: ORDER_STATUS.DELIVERED, label: ORDER_STATUS_LABELS[ORDER_STATUS.DELIVERED] },
  { value: ORDER_STATUS.CANCELLED, label: ORDER_STATUS_LABELS[ORDER_STATUS.CANCELLED] },
]

/**
 * OrderHistory Page Component
 * Displays list of user orders with filtering by status
 */
const OrderHistory = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const {
    orders,
    loading,
    error,
    loadOrders,
    getOrdersByStatus,
    orderCounts,
  } = useOrders()

  const [selectedStatus, setSelectedStatus] = useState('ALL')

  // Load orders on mount
  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const handleTabChange = (event, newValue) => {
    setSelectedStatus(newValue)
  }

  const handleOrderClick = (orderId) => {
    navigate(ROUTES.ORDER_DETAIL(orderId))
  }

  const handleStartShopping = () => {
    navigate(ROUTES.PRODUCTS)
  }

  const filteredOrders = getOrdersByStatus(selectedStatus)

  // Loading state
  if (loading && orders.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            My Orders
          </Typography>
          <Skeleton variant="text" width={100} height={24} />
        </Box>
        <Skeleton variant="rectangular" height={48} sx={{ mb: 3, borderRadius: 1 }} />
        <OrderListSkeleton />
      </Container>
    )
  }

  // Empty state (no orders at all)
  if (!loading && orders.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <EmptyState
          variant="orders"
          title="No orders yet"
          message="You haven&apos;t placed any orders yet. Start shopping to see your orders here."
          actionText="Start Shopping"
          onAction={handleStartShopping}
        />
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          My Orders
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {orderCounts.ALL} {orderCounts.ALL === 1 ? 'order' : 'orders'} total
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Status Filter Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={selectedStatus}
          onChange={handleTabChange}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons={isMobile ? 'auto' : false}
          allowScrollButtonsMobile
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              minWidth: isMobile ? 'auto' : 100,
            },
          }}
        >
          {TAB_STATUSES.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {tab.label}
                  <Typography
                    component="span"
                    variant="caption"
                    sx={{
                      bgcolor: 'action.selected',
                      borderRadius: 1,
                      px: 0.75,
                      py: 0.25,
                      ml: 0.5,
                    }}
                  >
                    {orderCounts[tab.value]}
                  </Typography>
                </Box>
              }
            />
          ))}
        </Tabs>
      </Box>

      {/* Orders Grid */}
      {filteredOrders.length > 0 ? (
        <Grid container spacing={3}>
          {filteredOrders.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order.id}>
              <OrderCard
                order={order}
                onClick={() => handleOrderClick(order.id)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No {ORDER_STATUS_LABELS[selectedStatus]?.toLowerCase()} orders
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You don&apos;t have any orders with this status.
          </Typography>
        </Box>
      )}
    </Container>
  )
}

export default OrderHistory
