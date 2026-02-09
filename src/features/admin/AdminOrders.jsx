import { useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Skeleton,
  Collapse,
  Chip,
} from '@mui/material'
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material'
import { useAdmin } from './hooks/useAdmin'
import OrderStatusSelect from './components/OrderStatusSelect'
import EmptyState from '@components/common/EmptyState'
import { formatCurrency, formatDate } from '@utils/formatters'
import { ORDER_STATUS, ORDER_STATUS_LABELS, DATE_FORMATS } from '@constants'

/**
 * OrderRow Component
 * Expandable table row for order details
 */
const OrderRow = ({ order, onStatusUpdate }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography fontWeight={600}>#{order.id}</Typography>
        </TableCell>
        <TableCell>
          {formatDate(order.createdAt, DATE_FORMATS.SHORT)}
        </TableCell>
        <TableCell>
          <Typography fontWeight={500}>{order.userEmail || 'Unknown'}</Typography>
          {order.userName && (
            <Typography variant="body2" color="text.secondary">
              {order.userName}
            </Typography>
          )}
        </TableCell>
        <TableCell>
          <Typography fontWeight={600}>
            {formatCurrency(order.totalAmount)}
          </Typography>
        </TableCell>
        <TableCell>
          <OrderStatusSelect
            status={order.status}
            orderId={order.id}
            onUpdate={onStatusUpdate}
          />
        </TableCell>
      </TableRow>

      {/* Expanded Order Details */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ py: 2, px: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Order Items
              </Typography>

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items?.map((item, index) => (
                    <TableRow key={item.id || index}>
                      <TableCell>
                        {item.productName || `Product #${item.productId}`}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(item.priceAtPurchase || item.price)}
                      </TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(
                          (item.priceAtPurchase || item.price) * item.quantity
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Shipping Address
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.shippingAddress}
                  </Typography>
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

OrderRow.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    userEmail: PropTypes.string,
    userName: PropTypes.string,
    totalAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    status: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        productId: PropTypes.number,
        productName: PropTypes.string,
        priceAtPurchase: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        quantity: PropTypes.number.isRequired,
      })
    ),
    shippingAddress: PropTypes.string,
  }).isRequired,
  onStatusUpdate: PropTypes.func.isRequired,
}

/**
 * AdminOrders Page
 * Order list with status management
 */
const AdminOrders = () => {
  const {
    orders,
    ordersLoading,
    loadOrders,
    updateOrderStatus,
  } = useAdmin()

  // Local state
  const [statusFilter, setStatusFilter] = useState('')

  // Load data on mount
  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => !statusFilter || order.status === statusFilter)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [orders, statusFilter])

  // Status counts
  const statusCounts = useMemo(() => {
    return orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {})
  }, [orders])

  return (
    <Box sx={{ width: '100%', px: 4, py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Order Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage customer orders
        </Typography>
      </Box>

      {/* Filters */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
        }}
      >
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status Filter"
          >
            <MenuItem value="">All Orders ({orders.length})</MenuItem>
            {Object.values(ORDER_STATUS).map((status) => (
              <MenuItem key={status} value={status}>
                {ORDER_STATUS_LABELS[status]} ({statusCounts[status] || 0})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Status summary chips */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {Object.entries(statusCounts).map(([status, count]) => (
            <Chip
              key={status}
              label={`${ORDER_STATUS_LABELS[status]}: ${count}`}
              size="small"
              variant={statusFilter === status ? 'filled' : 'outlined'}
              onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Box>

      {/* Orders Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 50 }} />
              <TableCell>Order ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordersLoading ? (
              [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="circular" width={30} height={30} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={60} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={150} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={80} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={120} />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyState
                    variant="search"
                    title={orders.length === 0 ? 'No orders yet' : 'No orders found'}
                    message={
                      orders.length === 0
                        ? 'Orders will appear here when customers make purchases'
                        : 'Try adjusting your filter'
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  onStatusUpdate={updateOrderStatus}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Results count */}
      {!ordersLoading && filteredOrders.length > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Showing {filteredOrders.length} of {orders.length} orders
        </Typography>
      )}
    </Box>
  )
}

export default AdminOrders
