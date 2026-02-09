import PropTypes from 'prop-types'
import { Box, Pagination as MuiPagination, Typography } from '@mui/material'

/**
 * Pagination Component
 * Displays pagination controls with info text
 *
 * @param {number} page - Current page (0-indexed from backend, 1-indexed for display)
 * @param {number} totalPages - Total number of pages
 * @param {number} totalElements - Total number of items
 * @param {number} pageSize - Items per page
 * @param {Function} onPageChange - Page change handler
 */
const Pagination = ({
  page = 0,
  totalPages = 1,
  totalElements = 0,
  pageSize = 12,
  onPageChange,
}) => {
  // Convert 0-indexed to 1-indexed for display
  const displayPage = page + 1

  const handleChange = (event, value) => {
    // Convert 1-indexed back to 0-indexed for backend
    onPageChange(value - 1)
  }

  if (totalPages <= 1) {
    return null
  }

  const startItem = page * pageSize + 1
  const endItem = Math.min((page + 1) * pageSize, totalElements)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        mt: 4,
        mb: 2,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Showing {startItem}-{endItem} of {totalElements} items
      </Typography>
      <MuiPagination
        count={totalPages}
        page={displayPage}
        onChange={handleChange}
        color="primary"
        shape="rounded"
        showFirstButton
        showLastButton
      />
    </Box>
  )
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalElements: PropTypes.number,
  pageSize: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
}

export default Pagination
