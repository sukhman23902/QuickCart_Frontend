import { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Skeleton } from '@mui/material'
import { PLACEHOLDER_IMAGE } from '@constants'

/**
 * Image Component
 * Image with lazy loading, fallback, and loading state
 *
 * @param {string} src - Image source URL
 * @param {string} alt - Image alt text
 * @param {number|string} width - Image width
 * @param {number|string} height - Image height
 * @param {string} objectFit - CSS object-fit property
 * @param {string} borderRadius - Border radius
 */
const Image = ({
  src,
  alt = '',
  width = '100%',
  height = 'auto',
  objectFit = 'cover',
  borderRadius = 0,
  ...rest
}) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const imageSrc = error || !src ? PLACEHOLDER_IMAGE : src

  return (
    <Box
      sx={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
        borderRadius,
      }}
    >
      {loading && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          sx={{ position: 'absolute', top: 0, left: 0 }}
        />
      )}
      <Box
        component="img"
        src={imageSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false)
          setError(true)
        }}
        sx={{
          width: '100%',
          height: '100%',
          objectFit,
          display: loading ? 'none' : 'block',
        }}
        {...rest}
      />
    </Box>
  )
}

Image.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  objectFit: PropTypes.oneOf(['cover', 'contain', 'fill', 'none', 'scale-down']),
  borderRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

export default Image
