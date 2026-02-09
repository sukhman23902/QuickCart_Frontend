import { useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  InputAdornment,
  FormHelperText,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { PLACEHOLDER_IMAGE, CURRENCY } from '@constants'

/**
 * Validation schema for product form
 */
const productSchema = yup.object().shape({
  name: yup
    .string()
    .required('Product name is required')
    .max(100, 'Name cannot exceed 100 characters'),
  description: yup
    .string()
    .max(1000, 'Description cannot exceed 1000 characters'),
  price: yup
    .number()
    .typeError('Price must be a number')
    .required('Price is required')
    .positive('Price must be positive')
    .max(9999999.99, 'Price is too high'),
  stockQuantity: yup
    .number()
    .typeError('Stock quantity must be a number')
    .required('Stock quantity is required')
    .integer('Stock must be a whole number')
    .min(0, 'Stock cannot be negative'),
  categoryId: yup
    .number()
    .typeError('Please select a category')
    .required('Category is required'),
  imageUrl: yup
    .string()
    .url('Must be a valid URL')
    .max(255, 'URL cannot exceed 255 characters'),
})

/**
 * ProductFormDialog Component
 * Modal dialog for creating/editing products
 *
 * @param {boolean} open - Dialog open state
 * @param {Function} onClose - Close handler
 * @param {Object} product - Product to edit (null for create)
 * @param {Array} categories - List of categories
 * @param {Function} onSubmit - Submit handler
 * @param {boolean} loading - Loading state
 */
const ProductFormDialog = ({
  open,
  onClose,
  product,
  categories = [],
  onSubmit,
  loading = false,
}) => {
  const isEdit = Boolean(product)

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      stockQuantity: '',
      categoryId: '',
      imageUrl: '',
    },
  })

  // Watch image URL for preview
  const imageUrl = watch('imageUrl')

  // Reset form when product changes or dialog opens
  useEffect(() => {
    if (open) {
      if (product) {
        reset({
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          stockQuantity: product.stockQuantity ?? product.stock ?? '',
          categoryId: product.categoryId || product.category?.id || '',
          imageUrl: product.imageUrl || '',
        })
      } else {
        reset({
          name: '',
          description: '',
          price: '',
          stockQuantity: '',
          categoryId: '',
          imageUrl: '',
        })
      }
    }
  }, [open, product, reset])

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data)
      onClose()
    } catch (error) {
      // Error handled by parent
    }
  }

  const handleClose = () => {
    if (!isSubmitting && !loading) {
      onClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="product-form-dialog-title"
    >
      <DialogTitle id="product-form-dialog-title">
        {isEdit ? 'Edit Product' : 'Create New Product'}
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Product Name */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Product Name"
                  fullWidth
                  required
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isSubmitting || loading}
                />
              )}
            />

            {/* Description */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  disabled={isSubmitting || loading}
                />
              )}
            />

            {/* Price and Stock */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Price"
                    fullWidth
                    required
                    type="number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">{CURRENCY.SYMBOL}</InputAdornment>
                      ),
                    }}
                    inputProps={{ step: '0.01', min: '0' }}
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    disabled={isSubmitting || loading}
                  />
                )}
              />

              <Controller
                name="stockQuantity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Stock Quantity"
                    fullWidth
                    required
                    type="number"
                    inputProps={{ min: '0', step: '1' }}
                    error={!!errors.stockQuantity}
                    helperText={errors.stockQuantity?.message}
                    disabled={isSubmitting || loading}
                  />
                )}
              />
            </Box>

            {/* Category */}
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth required error={!!errors.categoryId}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    {...field}
                    label="Category"
                    disabled={isSubmitting || loading}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.categoryId && (
                    <FormHelperText>{errors.categoryId.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            {/* Image URL */}
            <Controller
              name="imageUrl"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Image URL"
                  fullWidth
                  placeholder="https://example.com/image.jpg"
                  error={!!errors.imageUrl}
                  helperText={errors.imageUrl?.message || 'Leave empty for default image'}
                  disabled={isSubmitting || loading}
                />
              )}
            />

            {/* Image Preview */}
            <Box
              sx={{
                width: '100%',
                height: 200,
                bgcolor: 'background.default',
                borderRadius: 2,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box
                component="img"
                src={imageUrl || PLACEHOLDER_IMAGE}
                alt="Product preview"
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
                onError={(e) => {
                  e.target.src = PLACEHOLDER_IMAGE
                }}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleClose}
            disabled={isSubmitting || loading}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || loading}
            startIcon={
              (isSubmitting || loading) && <CircularProgress size={20} color="inherit" />
            }
          >
            {isEdit ? 'Save Changes' : 'Create Product'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

ProductFormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stockQuantity: PropTypes.number,
    stock: PropTypes.number,
    categoryId: PropTypes.number,
    category: PropTypes.shape({
      id: PropTypes.number,
    }),
    imageUrl: PropTypes.string,
  }),
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
}

export default ProductFormDialog
