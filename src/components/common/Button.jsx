import PropTypes from 'prop-types'
import { Button as MuiButton, CircularProgress } from '@mui/material'

/**
 * Button Component
 * Enhanced MUI Button with loading state
 *
 * @param {ReactNode} children - Button content
 * @param {boolean} loading - Loading state
 * @param {boolean} disabled - Disabled state
 * @param {string} variant - Button variant
 * @param {string} color - Button color
 * @param {string} size - Button size
 * @param {boolean} fullWidth - Full width button
 * @param {ReactNode} startIcon - Icon before text
 * @param {ReactNode} endIcon - Icon after text
 * @param {Function} onClick - Click handler
 */
const Button = ({
  children,
  loading = false,
  disabled = false,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  startIcon,
  endIcon,
  onClick,
  ...rest
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={onClick}
      startIcon={!loading && startIcon}
      endIcon={!loading && endIcon}
      {...rest}
    >
      {loading ? (
        <>
          <CircularProgress
            size={20}
            color="inherit"
            sx={{ mr: 1 }}
          />
          Loading...
        </>
      ) : (
        children
      )}
    </MuiButton>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'error',
    'info',
    'warning',
    'inherit',
  ]),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  onClick: PropTypes.func,
}

export default Button
