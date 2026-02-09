import { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Switch,
  CircularProgress,
  Box,
  Tooltip,
} from '@mui/material'
import ConfirmDialog from '@components/common/ConfirmDialog'

/**
 * UserStatusToggle Component
 * Toggle switch for enabling/disabling users with confirmation
 *
 * @param {number} userId - User ID
 * @param {boolean} isEnabled - Current status
 * @param {Function} onToggle - Toggle handler (id, newStatus) => Promise
 * @param {boolean} disabled - Disable the toggle
 * @param {boolean} isSelf - True if this is the current admin user
 */
const UserStatusToggle = ({
  userId,
  isEnabled,
  onToggle,
  disabled = false,
  isSelf = false,
}) => {
  const [loading, setLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleChange = async (event) => {
    const newStatus = event.target.checked

    // Show confirmation when disabling
    if (!newStatus) {
      setConfirmOpen(true)
      return
    }

    await performToggle(newStatus)
  }

  const performToggle = async (newStatus) => {
    setLoading(true)
    try {
      await onToggle(userId, newStatus)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDisable = async () => {
    setConfirmOpen(false)
    await performToggle(false)
  }

  const handleCancelDialog = () => {
    setConfirmOpen(false)
  }

  // Tooltip message
  const getTooltipMessage = () => {
    if (isSelf) return 'You cannot disable your own account'
    if (loading) return 'Updating...'
    return isEnabled ? 'Click to disable user' : 'Click to enable user'
  }

  return (
    <>
      <Tooltip title={getTooltipMessage()}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <Switch
            checked={isEnabled}
            onChange={handleChange}
            disabled={disabled || loading || isSelf}
            color={isEnabled ? 'success' : 'default'}
            inputProps={{
              'aria-label': `${isEnabled ? 'Disable' : 'Enable'} user`,
            }}
          />
          {loading && (
            <CircularProgress
              size={20}
              sx={{
                position: 'absolute',
                left: '50%',
                marginLeft: '-10px',
              }}
            />
          )}
        </Box>
      </Tooltip>

      {/* Confirmation Dialog for Disabling */}
      <ConfirmDialog
        open={confirmOpen}
        title="Disable User"
        message="Are you sure you want to disable this user? They will no longer be able to log in or make purchases."
        confirmText="Disable User"
        confirmColor="error"
        onConfirm={handleConfirmDisable}
        onCancel={handleCancelDialog}
      />
    </>
  )
}

UserStatusToggle.propTypes = {
  userId: PropTypes.number.isRequired,
  isEnabled: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  isSelf: PropTypes.bool,
}

export default UserStatusToggle
