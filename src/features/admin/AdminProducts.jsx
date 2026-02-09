import { useEffect, useState, useMemo } from 'react'
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Skeleton,
  Avatar,
  Tooltip,
} from '@mui/material'
import {
  Add,
  Search,
  Edit,
  Delete,
} from '@mui/icons-material'
import { useAdmin } from './hooks/useAdmin'
import ProductFormDialog from './components/ProductFormDialog'
import ConfirmDialog from '@components/common/ConfirmDialog'
import EmptyState from '@components/common/EmptyState'
import { formatCurrency } from '@utils/formatters'
import { useDebounce } from '@hooks/useDebounce'
import { PLACEHOLDER_IMAGE } from '@constants'

/**
 * AdminProducts Page
 * Product list with CRUD operations
 */
const AdminProducts = () => {
  const {
    products,
    productsLoading,
    categories,
    loadProducts,
    loadCategories,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useAdmin()

  // Local state
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  const debouncedSearch = useDebounce(searchQuery, 300)

  // Load data on mount
  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [loadProducts, loadCategories])

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        !debouncedSearch ||
        product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.description?.toLowerCase().includes(debouncedSearch.toLowerCase())

      const matchesCategory =
        !categoryFilter ||
        product.categoryId === categoryFilter ||
        product.category?.id === categoryFilter

      return matchesSearch && matchesCategory
    })
  }, [products, debouncedSearch, categoryFilter])

  // Handlers
  const handleOpenCreate = () => {
    setSelectedProduct(null)
    setFormOpen(true)
  }

  const handleOpenEdit = (product) => {
    setSelectedProduct(product)
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setFormOpen(false)
    setSelectedProduct(null)
  }

  const handleFormSubmit = async (data) => {
    setFormLoading(true)
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, data)
      } else {
        await createProduct(data)
      }
    } finally {
      setFormLoading(false)
    }
  }

  const handleOpenDelete = (product) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false)
    setProductToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete.id)
      handleCloseDelete()
    }
  }

  const getCategoryName = (product) => {
    if (product.category?.name) return product.category.name
    const category = categories.find((c) => c.id === product.categoryId)
    return category?.name || 'Uncategorized'
  }

  return (
    <Box sx={{ width: '100%', px: 4, py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Product Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your product catalog
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenCreate}
        >
          Add Product
        </Button>
      </Box>

      {/* Filters */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <TextField
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            label="Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Products Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productsLoading ? (
              [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="rectangular" width={50} height={50} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={200} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={80} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={60} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton width={100} />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyState
                    variant="search"
                    title={products.length === 0 ? 'No products yet' : 'No products found'}
                    message={
                      products.length === 0
                        ? 'Add your first product to get started'
                        : 'Try adjusting your search or filter'
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <Avatar
                      variant="rounded"
                      src={product.imageUrl || PLACEHOLDER_IMAGE}
                      alt={product.name}
                      sx={{ width: 50, height: 50 }}
                    >
                      {product.name.charAt(0)}
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={600}>{product.name}</Typography>
                    {product.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          maxWidth: 300,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {product.description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={600}>
                      {formatCurrency(product.price)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.stockQuantity ?? product.stock ?? 0}
                      color={
                        (product.stockQuantity ?? product.stock ?? 0) > 10
                          ? 'success'
                          : (product.stockQuantity ?? product.stock ?? 0) > 0
                            ? 'warning'
                            : 'error'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip label={getCategoryName(product)} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenEdit(product)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDelete(product)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Results count */}
      {!productsLoading && filteredProducts.length > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Showing {filteredProducts.length} of {products.length} products
        </Typography>
      )}

      {/* Product Form Dialog */}
      <ProductFormDialog
        open={formOpen}
        onClose={handleCloseForm}
        product={selectedProduct}
        categories={categories}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="error"
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDelete}
      />
    </Box>
  )
}

export default AdminProducts
