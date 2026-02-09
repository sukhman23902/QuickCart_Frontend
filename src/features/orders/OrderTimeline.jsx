import PropTypes from 'prop-types'
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import {
  ShoppingCartCheckout,
  Inventory2,
  LocalShipping,
  CheckCircle,
  Cancel,
} from '@mui/icons-material'
import { ORDER_STATUS } from '@constants'
import { formatDate } from '@utils/formatters'
import { DATE_FORMATS } from '@constants'

/**
 * Custom connector styling
 */
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  '&.MuiStepConnector-root': {
    top: 22,
  },
  '&.Mui-active, &.Mui-completed': {
    '& .MuiStepConnector-line': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  '& .MuiStepConnector-line': {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.divider,
    borderRadius: 1,
  },
  // Vertical mode adjustments
  '&.MuiStepConnector-vertical': {
    marginLeft: 22,
    padding: 0,
    '& .MuiStepConnector-line': {
      width: 3,
      minHeight: 40,
    },
  },
}))

/**
 * Custom step icon wrapper
 */
const StepIconWrapper = styled('div')(
  ({ theme, ownerState }) => ({
    backgroundColor: theme.palette.divider,
    zIndex: 1,
    color: theme.palette.text.secondary,
    width: 46,
    height: 46,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    ...(ownerState.active && {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      boxShadow: `0 4px 10px 0 ${theme.palette.primary.main}40`,
    }),
    ...(ownerState.completed && {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.success.contrastText,
    }),
    ...(ownerState.error && {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
    }),
  })
)

/**
 * Timeline steps configuration
 */
const TIMELINE_STEPS = [
  {
    key: 'placed',
    label: 'Order Placed',
    icon: ShoppingCartCheckout,
    description: 'Your order has been received',
  },
  {
    key: 'processing',
    label: 'Processing',
    icon: Inventory2,
    description: 'Your order is being prepared',
  },
  {
    key: 'shipped',
    label: 'Shipped',
    icon: LocalShipping,
    description: 'Your order is on its way',
  },
  {
    key: 'delivered',
    label: 'Delivered',
    icon: CheckCircle,
    description: 'Your order has been delivered',
  },
]

/**
 * Get active step index based on order status
 * @param {string} status - Order status
 * @returns {number} Step index
 */
const getActiveStep = (status) => {
  switch (status) {
    case ORDER_STATUS.PENDING:
      return 1 // Processing
    case ORDER_STATUS.SHIPPED:
      return 2 // Shipped
    case ORDER_STATUS.DELIVERED:
      return 4 // Completed (past last step)
    case ORDER_STATUS.CANCELLED:
      return -1 // Special case
    default:
      return 0
  }
}

/**
 * Custom Step Icon Component
 */
const CustomStepIcon = ({ active, completed, error, icon: Icon }) => {
  return (
    <StepIconWrapper ownerState={{ active, completed, error }}>
      <Icon sx={{ fontSize: 24 }} />
    </StepIconWrapper>
  )
}

CustomStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
  error: PropTypes.bool,
  icon: PropTypes.elementType.isRequired,
}

/**
 * OrderTimeline Component
 * Visual stepper showing order progress
 *
 * @param {string} currentStatus - Current order status
 * @param {string} orderDate - Order date string
 */
const OrderTimeline = ({ currentStatus, orderDate }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const activeStep = getActiveStep(currentStatus)
  const isCancelled = currentStatus === ORDER_STATUS.CANCELLED

  // If cancelled, show a different view
  if (isCancelled) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 3,
          px: 2,
          bgcolor: 'error.lighter',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'error.light',
        }}
      >
        <StepIconWrapper ownerState={{ error: true }}>
          <Cancel sx={{ fontSize: 24 }} />
        </StepIconWrapper>
        <Typography variant="h6" fontWeight={600} color="error.main" sx={{ mt: 2 }}>
          Order Cancelled
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          This order was cancelled
        </Typography>
        {orderDate && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Order placed on {formatDate(orderDate, DATE_FORMATS.SHORT)}
          </Typography>
        )}
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', py: 2 }}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel={!isMobile}
        orientation={isMobile ? 'vertical' : 'horizontal'}
        connector={<CustomConnector />}
      >
        {TIMELINE_STEPS.map((step, index) => {
          const isCompleted = index < activeStep
          const isActive = index === activeStep

          return (
            <Step key={step.key} completed={isCompleted}>
              <StepLabel
                StepIconComponent={() => (
                  <CustomStepIcon
                    active={isActive}
                    completed={isCompleted}
                    error={false}
                    icon={step.icon}
                  />
                )}
              >
                <Box
                  sx={{
                    textAlign: isMobile ? 'left' : 'center',
                    ml: isMobile ? 1 : 0,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight={isActive || isCompleted ? 600 : 400}
                    color={isActive || isCompleted ? 'text.primary' : 'text.secondary'}
                  >
                    {step.label}
                  </Typography>
                  {!isMobile && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 0.5 }}
                    >
                      {step.description}
                    </Typography>
                  )}
                </Box>
              </StepLabel>
            </Step>
          )
        })}
      </Stepper>

      {/* Order date caption */}
      {orderDate && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mt: 3 }}
        >
          Order placed on {formatDate(orderDate, DATE_FORMATS.SHORT)}
        </Typography>
      )}
    </Box>
  )
}

OrderTimeline.propTypes = {
  currentStatus: PropTypes.oneOf(Object.values(ORDER_STATUS)).isRequired,
  orderDate: PropTypes.string,
}

export default OrderTimeline
