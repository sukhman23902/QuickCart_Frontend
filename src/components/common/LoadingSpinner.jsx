import PropTypes from 'prop-types'
import { Box, CircularProgress, Typography } from '@mui/material'

/**
 * LoadingSpinner Component
 * Displays a loading spinner with optional message
 *
 * @param {string} message - Optional loading message
 * @param {string} size - Spinner size (small, medium, large)
 * @param {boolean} fullScreen - Show as full-screen overlay
 */
const LoadingSpinner = ({ message, size = 'medium', fullScreen = false }) => {
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 60,
  }

  const spinnerSize = sizeMap[size] || sizeMap.medium

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <CircularProgress size={spinnerSize} thickness={4} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  )

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 9999,
        }}
      >
        {content}
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
        py: 4,
      }}
    >
      {content}
    </Box>
  )
}

LoadingSpinner.propTypes = {
  message: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullScreen: PropTypes.bool,
}

export default LoadingSpinner
