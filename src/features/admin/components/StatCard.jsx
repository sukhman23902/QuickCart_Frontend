import React from 'react'
import PropTypes from 'prop-types'
import { Box, Card, CardContent, Typography, alpha } from '@mui/material'
import { TrendingUp, TrendingDown } from '@mui/icons-material'

/**
 * StatCard Component
 * Displays a single statistic with icon, value, and optional trend
 *
 * @param {string} title - Card title
 * @param {string|number} value - Main value to display
 * @param {ReactNode} icon - MUI icon component
 * @param {string} color - Theme color (primary, secondary, success, warning, error, info)
 * @param {number} trend - Optional trend percentage (positive or negative)
 * @param {string} subtitle - Optional subtitle text
 * @param {Function} onClick - Optional click handler
 */
const StatCard = ({
  title,
  value,
  icon,
  color = 'primary',
  trend,
  subtitle,
  onClick,
}) => {
  const hasTrend = trend !== undefined && trend !== null

  return (
    <Card
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick
          ? {
              transform: 'translateY(-4px)',
              boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette[color].main, 0.2)}`,
            }
          : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {/* Left side - Text content */}
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={500}
              gutterBottom
            >
              {title}
            </Typography>

            <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
              {value}
            </Typography>

            {/* Trend indicator */}
            {hasTrend && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mt: 1,
                }}
              >
                {trend >= 0 ? (
                  <TrendingUp sx={{ fontSize: 18, color: 'success.main' }} />
                ) : (
                  <TrendingDown sx={{ fontSize: 18, color: 'error.main' }} />
                )}
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color={trend >= 0 ? 'success.main' : 'error.main'}
                >
                  {trend >= 0 ? '+' : ''}
                  {trend}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  vs last month
                </Typography>
              </Box>
            )}

            {/* Subtitle */}
            {subtitle && !hasTrend && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {subtitle}
              </Typography>
            )}
          </Box>

          {/* Right side - Icon */}
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: (theme) => alpha(theme.palette[color].main, 0.1),
              color: `${color}.main`,
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 28 } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.element.isRequired,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'info']),
  trend: PropTypes.number,
  subtitle: PropTypes.string,
  onClick: PropTypes.func,
}

export default StatCard
