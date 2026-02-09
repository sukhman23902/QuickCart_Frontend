import PropTypes from 'prop-types'
import { Box, Skeleton, Card, CardContent } from '@mui/material'

/**
 * LoadingSkeleton Component
 * Displays skeleton loaders for different content types
 *
 * @param {string} variant - Skeleton variant (text, card, product, list)
 * @param {number} count - Number of skeleton items
 */
const LoadingSkeleton = ({ variant = 'card', count = 1 }) => {
  const renderTextSkeleton = () => (
    <Box>
      <Skeleton variant="text" width="80%" height={30} />
      <Skeleton variant="text" width="60%" height={20} />
      <Skeleton variant="text" width="90%" height={20} />
    </Box>
  )

  const renderCardSkeleton = () => (
    <Card>
      <Skeleton variant="rectangular" height={200} />
      <CardContent>
        <Skeleton variant="text" width="80%" height={30} />
        <Skeleton variant="text" width="60%" height={20} />
      </CardContent>
    </Card>
  )

  const renderProductSkeleton = () => (
    <Card>
      <Skeleton variant="rectangular" height={250} />
      <CardContent>
        <Skeleton variant="text" width="90%" height={25} />
        <Skeleton variant="text" width="40%" height={30} />
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Skeleton variant="rectangular" width={100} height={36} />
          <Skeleton variant="rectangular" width={100} height={36} />
        </Box>
      </CardContent>
    </Card>
  )

  const renderListSkeleton = () => (
    <Box sx={{ display: 'flex', gap: 2, py: 2 }}>
      <Skeleton variant="rectangular" width={80} height={80} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="70%" height={25} />
        <Skeleton variant="text" width="50%" height={20} />
        <Skeleton variant="text" width="30%" height={20} />
      </Box>
    </Box>
  )

  const renderSkeleton = () => {
    switch (variant) {
      case 'text':
        return renderTextSkeleton()
      case 'card':
        return renderCardSkeleton()
      case 'product':
        return renderProductSkeleton()
      case 'list':
        return renderListSkeleton()
      default:
        return renderCardSkeleton()
    }
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Box key={index} sx={{ mb: variant === 'list' ? 0 : 2 }}>
          {renderSkeleton()}
        </Box>
      ))}
    </>
  )
}

LoadingSkeleton.propTypes = {
  variant: PropTypes.oneOf(['text', 'card', 'product', 'list']),
  count: PropTypes.number,
}

export default LoadingSkeleton
