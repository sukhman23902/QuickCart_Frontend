import PropTypes from 'prop-types'
import { Box, Typography } from '@mui/material'

/**
 * ProfileInfoRow Component
 * Displays a labeled info field with an icon
 *
 * @param {React.ElementType} icon - MUI icon component
 * @param {string} label - Field label
 * @param {string} value - Field value
 */
const ProfileInfoRow = ({ icon: Icon, label, value }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, py: 1.5 }}>
      <Icon sx={{ color: 'primary.main', mt: 0.5 }} />
      <Box>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1" fontWeight={500}>
          {value || 'Not provided'}
        </Typography>
      </Box>
    </Box>
  )
}

ProfileInfoRow.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
}

export default ProfileInfoRow
