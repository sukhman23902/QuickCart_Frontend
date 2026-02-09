import { useEffect, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  Button,
  Chip,
  Skeleton,
  Divider,
} from '@mui/material'
import {
  Inventory,
  ShoppingCart,
  People,
  AttachMoney,
  Add,
  Visibility,
  PersonAdd,
} from '@mui/icons-material'
import StatCard from './components/StatCard'
import { useAdmin } from './hooks/useAdmin'
import { formatCurrency, formatDate } from '@utils/formatters'
import { ROUTES, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, ADMIN_REFRESH_INTERVAL, DATE_FORMATS } from '@constants'

/**
 * AdminDashboard Page
 * Main admin overview with statistics and quick actions
 */
const AdminDashboard = () => {
  const navigate = useNavigate()
  const {
    productsLoading,
    ordersLoading,
    usersLoading,
    loadDashboardData,
    getStats,
  } = useAdmin()

  const loading = productsLoading || ordersLoading || usersLoading
  const stats = getStats()

  // Load data on mount
  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  // Auto-refresh data
  useEffect(() => {
    const interval = setInterval(() => {
      loadDashboardData()
    }, ADMIN_REFRESH_INTERVAL)

    return () => clearInterval(interval)
  }, [loadDashboardData])

  return (
    <Box sx={{ width: '100%', px: 4, py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here&apos;s what&apos;s happening with your store.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
          ) : (
            <StatCard
              title="Total Products"
              value={stats.totalProducts}
              icon={<Inventory />}
              color="primary"
              subtitle="Active products in store"
              onClick={() => navigate(ROUTES.ADMIN.PRODUCTS)}
            />
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
          ) : (
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={<ShoppingCart />}
              color="info"
              subtitle={`${stats.pendingOrders} pending`}
              onClick={() => navigate(ROUTES.ADMIN.ORDERS)}
            />
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
          ) : (
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={<People />}
              color="success"
              subtitle={`${stats.activeUsers} active`}
              onClick={() => navigate(ROUTES.ADMIN.USERS)}
            />
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
          ) : (
            <StatCard
              title="Total Revenue"
              value={formatCurrency(stats.totalRevenue)}
              icon={<AttachMoney />}
              color="secondary"
              subtitle="From delivered orders"
            />
          )}
        </Grid>
      </Grid>

      {/* Recent Orders & Quick Actions */}
      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight={600}>
                  Recent Orders
                </Typography>
                <Button
                  size="small"
                  endIcon={<Visibility />}
                  onClick={() => navigate(ROUTES.ADMIN.ORDERS)}
                >
                  View All
                </Button>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {loading ? (
                [...Array(5)].map((_, i) => (
                  <Skeleton key={i} height={60} sx={{ mb: 1 }} />
                ))
              ) : stats.recentOrders.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                  No orders yet
                </Typography>
              ) : (
                <List disablePadding>
                  {stats.recentOrders.map((order, index) => (
                    <Fragment key={order.id}>
                      <ListItem
                        sx={{
                          px: 0,
                          py: 1.5,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Box>
                          <Typography variant="body1" fontWeight={600}>
                            Order #{order.id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {order.userEmail || 'Unknown customer'} -{' '}
                            {formatDate(order.createdAt, DATE_FORMATS.SHORT)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="body1" fontWeight={600}>
                            {formatCurrency(order.totalAmount)}
                          </Typography>
                          <Chip
                            label={ORDER_STATUS_LABELS[order.status] || order.status}
                            color={ORDER_STATUS_COLORS[order.status] || 'default'}
                            size="small"
                          />
                        </Box>
                      </ListItem>
                      {index < stats.recentOrders.length - 1 && <Divider />}
                    </Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                Quick Actions
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  fullWidth
                  onClick={() => navigate(ROUTES.ADMIN.PRODUCTS)}
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  Add New Product
                </Button>

                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<ShoppingCart />}
                  fullWidth
                  onClick={() => navigate(ROUTES.ADMIN.ORDERS)}
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  View All Orders
                </Button>

                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<People />}
                  fullWidth
                  onClick={() => navigate(ROUTES.ADMIN.USERS)}
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  Manage Users
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<PersonAdd />}
                  fullWidth
                  onClick={() => navigate(ROUTES.ADMIN.USERS)}
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  Create Admin
                </Button>
              </Box>

              {/* Order Stats Summary */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                  Orders by Status
                </Typography>

                {loading ? (
                  <Skeleton height={100} />
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {Object.entries(stats.ordersByStatus).map(([status, count]) => (
                      <Chip
                        key={status}
                        label={`${ORDER_STATUS_LABELS[status] || status}: ${count}`}
                        color={ORDER_STATUS_COLORS[status] || 'default'}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminDashboard
