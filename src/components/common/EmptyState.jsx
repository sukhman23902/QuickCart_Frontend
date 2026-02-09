import PropTypes from 'prop-types'
import { Box, Typography, Button } from '@mui/material'
import {
  ShoppingCartOutlined,
  FavoriteBorderOutlined,
  SearchOffOutlined,
  InboxOutlined,
} from '@mui/icons-material'

/**
 * EmptyState Component
 * Displays an empty state with icon, message, and optional action
 *
 * @param {string} variant - Empty state variant (cart, wishlist, search, orders, generic)
 * @param {string} title - Title text
 * @param {string} message - Description message
 * @param {string} actionText - Action button text
 * @param {Function} onAction - Action button click handler
 */
const EmptyState = ({
  variant = 'generic',
  title,
  message,
  actionText,
  onAction,
}) => {
  const getIcon = () => {
    const iconProps = { sx: { fontSize: 80, color: 'text.disabled', mb: 2 } }

    switch (variant) {
      case 'cart':
        return <ShoppingCartOutlined {...iconProps} />
      case 'wishlist':
        return <FavoriteBorderOutlined {...iconProps} />
      case 'search':
        return <SearchOffOutlined {...iconProps} />
      case 'orders':
        return <InboxOutlined {...iconProps} />
      default:
        return <InboxOutlined {...iconProps} />
    }
  }

  const getDefaultContent = () => {
    switch (variant) {
      case 'cart':
        return {
          title: title || 'Your cart is empty',
          message:
            message ||
            'Looks like you have not added anything to your cart yet.',
          actionText: actionText || 'Start Shopping',
        }
      case 'wishlist':
        return {
          title: title || 'Your wishlist is empty',
          message:
            message || 'Save your favorite items to purchase them later.',
          actionText: actionText || 'Browse Products',
        }
      case 'search':
        return {
          title: title || 'No results found',
          message:
            message ||
            'We couldn not find any products matching your search.',
          actionText: actionText || 'Clear Search',
        }
      case 'orders':
        return {
          title: title || 'No orders yet',
          message: message || 'You haven not placed any orders yet.',
          actionText: actionText || 'Start Shopping',
        }
      default:
        return {
          title: title || 'Nothing here',
          message: message || 'There is nothing to show at the moment.',
          actionText: actionText || 'Go Back',
        }
    }
  }

  const content = getDefaultContent()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        p: 4,
        textAlign: 'center',
      }}
    >
      {getIcon()}
      <Typography variant="h5" gutterBottom fontWeight={600}>
        {content.title}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ maxWidth: 500, mb: 3 }}
      >
        {content.message}
      </Typography>
      {onAction && content.actionText && (
        <Button variant="contained" onClick={onAction} size="large">
          {content.actionText}
        </Button>
      )}
    </Box>
  )
}

EmptyState.propTypes = {
  variant: PropTypes.oneOf(['cart', 'wishlist', 'search', 'orders', 'generic']),
  title: PropTypes.string,
  message: PropTypes.string,
  actionText: PropTypes.string,
  onAction: PropTypes.func,
}

export default EmptyState
