import { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Button,
  Divider,
  Switch,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Close, FilterList } from '@mui/icons-material'

/**
 * ProductFilters Component
 * Sidebar with filters for products (category, stock status)
 *
 * @param {Array} categories - List of categories
 * @param {Object} filters - Current filter values
 * @param {Function} onFilterChange - Handler for filter changes
 */
const ProductFilters = ({ categories = [], filters = {}, onFilterChange }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)

  const [localFilters, setLocalFilters] = useState({
    categoryId: filters.categoryId || null,
    inStock: filters.inStock || false,
  })

  const handleCategoryChange = (categoryId) => {
    const newCategoryId = localFilters.categoryId === categoryId ? null : categoryId
    const newFilters = { ...localFilters, categoryId: newCategoryId }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleStockChange = (event) => {
    const newFilters = { ...localFilters, inStock: event.target.checked }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      categoryId: null,
      inStock: false,
    }
    setLocalFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters = localFilters.categoryId !== null || localFilters.inStock

  const FiltersContent = () => (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList color="primary" />
          <Typography variant="h6" fontWeight={700}>
            Filters
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={() => setMobileOpen(false)} size="small">
            <Close />
          </IconButton>
        )}
      </Box>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          fullWidth
          variant="outlined"
          size="small"
          onClick={handleClearFilters}
          sx={{ mb: 3 }}
        >
          Clear All Filters
        </Button>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Categories
          </Typography>
          <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
            <FormGroup>
              {categories.map((category) => (
                <FormControlLabel
                  key={category.id}
                  control={
                    <Checkbox
                      checked={localFilters.categoryId === category.id}
                      onChange={() => handleCategoryChange(category.id)}
                    />
                  }
                  label={category.name}
                />
              ))}
            </FormGroup>
          </FormControl>
          <Divider sx={{ mb: 3 }} />
        </>
      )}

      {/* In Stock */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" fontWeight={600}>
          In Stock Only
        </Typography>
        <Switch
          checked={localFilters.inStock}
          onChange={handleStockChange}
          color="primary"
        />
      </Box>
    </Box>
  )

  if (isMobile) {
    return (
      <>
        {/* Mobile Filter Button */}
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={() => setMobileOpen(true)}
          fullWidth
          sx={{ mb: 2 }}
        >
          Filters {hasActiveFilters && `(${hasActiveFilters})`}
        </Button>

        {/* Mobile Drawer */}
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: 300,
            },
          }}
        >
          <FiltersContent />
        </Drawer>
      </>
    )
  }

  // Desktop Sidebar
  return (
    <Box
      sx={{
        width: 280,
        flexShrink: 0,
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        height: 'fit-content',
        position: 'sticky',
        top: 80,
      }}
    >
      <FiltersContent />
    </Box>
  )
}

ProductFilters.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  filters: PropTypes.shape({
    categoryId: PropTypes.number,
    inStock: PropTypes.bool,
  }),
  onFilterChange: PropTypes.func.isRequired,
}

export default ProductFilters
