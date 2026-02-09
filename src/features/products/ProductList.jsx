import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useMediaQuery,
  useTheme,
  Alert,
} from '@mui/material'
import { Search } from '@mui/icons-material'
import { fetchProducts, setFilters, setPagination } from '@features/products/productsSlice'
import { useWishlist } from '@features/wishlist/useWishlist'
import ProductCard from './ProductCard'
import ProductFilters from './ProductFilters'
import LoadingSkeleton from '@components/common/LoadingSkeleton'
import EmptyState from '@components/common/EmptyState'
import Pagination from '@components/common/Pagination'
import { useDebounce } from '@hooks/useDebounce'
import { scrollToTop } from '@utils/helpers'

/**
 * ProductList Page
 * Displays products with filters, search, and pagination
 */
const ProductList = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const { list: products, loading, error, filters, pagination } = useSelector(
    (state) => state.products
  )
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { toggleItem, isInWishlist, loadWishlist } = useWishlist()

  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || '')
  const [sortBy, setSortBy] = useState(filters.sortBy || 'name,asc')
  const [categories, setCategories] = useState([])

  const debouncedSearch = useDebounce(searchQuery, 500)

  // Fetch categories (mock data for now - will come from API later)
  useEffect(() => {
    // TODO: Fetch from API when backend endpoint is ready
    setCategories([
      { id: 1, name: 'Electronics' },
      { id: 2, name: 'Clothing' },
      { id: 3, name: 'Books' },
      { id: 4, name: 'Home & Garden' },
      { id: 5, name: 'Sports' },
    ])
  }, [])

  // Fetch products when filters change
  useEffect(() => {
    const fetchParams = {
      ...filters,
      searchQuery: debouncedSearch,
      sortBy,
      page: pagination.page || 0,
      size: pagination.size || 12,
    }
    dispatch(fetchProducts(fetchParams))
  }, [dispatch, filters, debouncedSearch, sortBy, pagination.page, pagination.size])

  // Update filters in Redux when they change locally
  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters))
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
  }

  const handlePageChange = (newPage) => {
    dispatch(setPagination({ page: newPage }))
    scrollToTop()
  }

  // Load wishlist on mount (if authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist()
    }
  }, [isAuthenticated, loadWishlist])

  const handleAddToWishlist = (product) => {
    toggleItem(product.id)
  }

  return (
    <Box sx={{ width: '100%', px: 4, py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 4 }}>
        Products
      </Typography>

      {/* Search and Sort Bar */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        {/* Sort */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select value={sortBy} onChange={handleSortChange} label="Sort By">
            <MenuItem value="name,asc">Name (A-Z)</MenuItem>
            <MenuItem value="name,desc">Name (Z-A)</MenuItem>
            <MenuItem value="price,asc">Price (Low to High)</MenuItem>
            <MenuItem value="price,desc">Price (High to Low)</MenuItem>
            <MenuItem value="createdAt,desc">Newest First</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Filters Sidebar */}
        {!isMobile && (
          <ProductFilters
            categories={categories}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        )}

        {/* Products Grid */}
        <Box sx={{ flex: 1 }}>
          {/* Mobile Filters */}
          {isMobile && (
            <ProductFilters
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          )}

          {/* Loading State */}
          {loading && !products.length && (
            <Grid container spacing={3}>
              {[...Array(12)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <LoadingSkeleton variant="product" />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Empty State */}
          {!loading && !products.length && (
            <EmptyState
              variant="search"
              title="No products found"
              message="Try adjusting your filters or search query"
            />
          )}

          {/* Products Grid */}
          {products.length > 0 && (
            <>
              <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <ProductCard
                      product={product}
                      onAddToWishlist={handleAddToWishlist}
                      isInWishlist={isInWishlist(product.id)}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </Box>
              )}

              {/* Results Count */}
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mt: 2 }}
              >
                Showing {products.length} of {pagination.totalElements || products.length} products
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default ProductList
