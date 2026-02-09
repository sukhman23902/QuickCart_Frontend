import PropTypes from 'prop-types'
import { Avatar } from '@mui/material'
import { Person } from '@mui/icons-material'

/**
 * ProfileAvatar Component
 * Large avatar displaying user initials or fallback icon
 *
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @param {string} size - Avatar size (small, medium, large)
 */
const ProfileAvatar = ({ firstName, lastName, size = 'large' }) => {

  const getInitials = () => {
    const first = firstName?.charAt(0) || ''
    const last = lastName?.charAt(0) || ''
    return (first + last).toUpperCase() || null
  }

  const sizes = {
    small: { width: 40, height: 40, fontSize: 16 },
    medium: { width: 60, height: 60, fontSize: 24 },
    large: { width: 100, height: 100, fontSize: 40 },
  }

  const sizeConfig = sizes[size] || sizes.large
  const initials = getInitials()

  return (
    <Avatar
      sx={{
        width: sizeConfig.width,
        height: sizeConfig.height,
        fontSize: sizeConfig.fontSize,
        bgcolor: 'primary.main',
        fontWeight: 600,
      }}
    >
      {initials || <Person sx={{ fontSize: sizeConfig.fontSize }} />}
    </Avatar>
  )
}

ProfileAvatar.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
}

export default ProfileAvatar
