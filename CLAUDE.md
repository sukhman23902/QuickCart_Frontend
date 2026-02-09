# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the QuickCart frontend codebase.

## Project Overview

QuickCart Frontend is a modern, classy e-commerce web application built with React 18 and JavaScript. It integrates with a Spring Boot backend API to provide a complete shopping experience with features including product browsing, cart management, checkout, order tracking, wishlist, product reviews, and an admin panel.

**Technology Stack:**
- React 18 (JavaScript)
- Redux Toolkit + Redux Persist
- Material-UI (MUI) v5
- React Router v6
- Axios
- Vite (build tool)

**Design Philosophy:** Modern, classy, professional aesthetic with excellent UX

## Quick Start Commands

```bash
# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Run tests
npm run test
```

## Project Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Application                        │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │   Routes   │→ │  Components  │→ │  Redux Actions   │    │
│  └────────────┘  └──────────────┘  └──────────────────┘    │
│         ↓                ↓                    ↓              │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │   Pages    │  │ MUI Theme    │  │  Redux Store     │    │
│  └────────────┘  └──────────────┘  └──────────────────┘    │
│                                              ↓               │
│                                   ┌──────────────────┐      │
│                                   │  Redux Persist   │      │
│                                   │  (localStorage)  │      │
│                                   └──────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                           ↓
                    ┌──────────────┐
                    │ Axios Client │
                    └──────────────┘
                           ↓
            ┌──────────────────────────────┐
            │  Spring Boot Backend API     │
            │  (http://localhost:8080/api) │
            └──────────────────────────────┘
```

### Application Flow

1. **User Authentication:**
   - User logs in → JWT token received → Stored in Redux + localStorage
   - Token auto-injected in all API requests via Axios interceptors
   - Protected routes redirect to login if not authenticated

2. **Guest vs Authenticated User:**
   - **Guest:** Cart stored in Redux + localStorage (client-side)
   - **Authenticated:** Cart synced with backend, guest cart merged on login

3. **State Management:**
   - Redux Toolkit for global state (auth, cart, products, orders, wishlist, reviews)
   - Redux Persist for cart and auth persistence
   - Component-level state for UI-specific data

4. **API Communication:**
   - Axios instance with base URL and interceptors
   - Automatic JWT token injection
   - Centralized error handling
   - Loading states managed in Redux

## Folder Structure

```
src/
├── app/
│   └── store.js                 # Redux store configuration
│
├── features/                     # Feature-based modules (Redux slices + components)
│   ├── auth/
│   │   ├── authSlice.js         # Auth Redux slice
│   │   ├── Login.jsx            # Login page
│   │   ├── Register.jsx         # Registration page
│   │   └── PrivateRoute.jsx     # Protected route wrapper
│   │
│   ├── products/
│   │   ├── productsSlice.js     # Products Redux slice
│   │   ├── ProductList.jsx      # Product listing page
│   │   ├── ProductDetail.jsx    # Product detail page
│   │   ├── ProductCard.jsx      # Product card component
│   │   └── ProductFilters.jsx   # Filters sidebar
│   │
│   ├── cart/
│   │   ├── cartSlice.js         # Cart Redux slice
│   │   ├── Cart.jsx             # Cart page
│   │   ├── CartItem.jsx         # Cart item component
│   │   └── MiniCart.jsx         # Header mini cart dropdown
│   │
│   ├── orders/
│   │   ├── ordersSlice.js       # Orders Redux slice
│   │   ├── Checkout.jsx         # Checkout page
│   │   ├── OrderHistory.jsx     # Order history page
│   │   └── OrderDetail.jsx      # Order detail page
│   │
│   ├── wishlist/
│   │   ├── wishlistSlice.js     # Wishlist Redux slice
│   │   └── Wishlist.jsx         # Wishlist page
│   │
│   ├── reviews/
│   │   ├── reviewsSlice.js      # Reviews Redux slice
│   │   ├── ReviewList.jsx       # Product reviews list
│   │   └── ReviewForm.jsx       # Add/edit review form
│   │
│   └── admin/
│       ├── AdminDashboard.jsx   # Admin overview
│       ├── ProductManagement.jsx
│       ├── OrderManagement.jsx
│       └── UserManagement.jsx
│
├── components/                   # Shared/reusable components
│   ├── layout/
│   │   ├── Header.jsx           # App header with navigation
│   │   ├── Footer.jsx           # App footer
│   │   ├── Sidebar.jsx          # Mobile navigation drawer
│   │   └── Breadcrumbs.jsx      # Navigation breadcrumbs
│   │
│   ├── common/
│   │   ├── Button.jsx           # Custom button variants
│   │   ├── Card.jsx             # Custom card component
│   │   ├── Modal.jsx            # Reusable modal
│   │   ├── ConfirmDialog.jsx    # Confirmation dialog
│   │   ├── LoadingSpinner.jsx   # Loading indicator
│   │   └── ErrorBoundary.jsx    # Error boundary wrapper
│   │
│   └── ui/
│       ├── ProductSkeleton.jsx  # Skeleton loader for products
│       ├── EmptyState.jsx       # Empty state component
│       └── Pagination.jsx       # Pagination controls
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.js               # Authentication hook
│   ├── useCart.js               # Cart operations hook
│   ├── useDebounce.js           # Debounce hook for search
│   └── useLocalStorage.js       # localStorage wrapper
│
├── services/                     # API service layer
│   ├── api.js                   # Axios instance + interceptors
│   ├── authService.js           # Auth API calls
│   ├── productService.js        # Product API calls
│   ├── cartService.js           # Cart API calls
│   ├── orderService.js          # Order API calls
│   ├── reviewService.js         # Review API calls
│   ├── wishlistService.js       # Wishlist API calls
│   └── adminService.js          # Admin API calls
│
├── utils/                        # Utility functions
│   ├── formatters.js            # Format currency, dates, etc.
│   ├── validators.js            # Validation helpers
│   └── helpers.js               # General helper functions
│
├── constants/
│   └── index.js                 # App constants (API routes, statuses, etc.)
│
├── theme/
│   └── theme.js                 # MUI theme customization
│
├── assets/                       # Static assets
│   ├── images/
│   └── icons/
│
├── App.jsx                       # Main app component with routes
├── main.jsx                      # Entry point
└── index.css                     # Global CSS
```

## Redux State Structure

```javascript
{
  auth: {
    user: { id, firstName, lastName, email, roles },
    token: "jwt.token.here",
    isAuthenticated: true/false,
    loading: false,
    error: null
  },

  cart: {
    items: [
      { id, productId, productName, productPrice, productImageUrl, quantity, subtotal }
    ],
    totalAmount: "999.99",
    loading: false,
    error: null
  },

  products: {
    list: [...products],
    selectedProduct: {...},
    filters: { categoryId, priceRange, searchQuery, sortBy, inStock },
    pagination: { page, size, totalPages, totalElements },
    loading: false,
    error: null
  },

  orders: {
    list: [...orders],
    currentOrder: {...},
    loading: false,
    error: null
  },

  wishlist: {
    items: [...products],
    loading: false,
    error: null
  },

  reviews: {
    productReviews: [...reviews],
    loading: false,
    error: null
  },

  ui: {
    notifications: [],
    globalLoading: false
  }
}
```

## Backend API Integration

### Base URL
- **Development:** `http://localhost:8080/api`
- **Production:** Set in `.env.production`

### API Endpoints Reference

#### Authentication (Public)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login (returns JWT token)
- `POST /auth/logout` - Logout (blacklist token)

#### Products (Public)
- `GET /products` - List products (supports `?categoryId=1&sortBy=price,asc&q=laptop&page=0&size=12`)
- `GET /products/{id}` - Get product details

#### Categories (Public)
- `GET /categories` - List all categories

#### Cart (Requires ROLE_USER)
- `GET /cart` - Get user's cart
- `POST /cart/items` - Add/update item `{ productId, quantity }`
- `DELETE /cart/items/{productId}` - Remove item
- `POST /cart/merge` - Merge guest cart after login

#### Orders (Requires ROLE_USER)
- `POST /orders` - Create order `{ shippingAddress, paymentMethodId }`
- `GET /orders` - Get user's orders
- `GET /orders/{id}` - Get order details

#### Wishlist (Requires ROLE_USER) - **Backend API needed**
- `GET /wishlist` - Get wishlist
- `POST /wishlist/items` - Add to wishlist `{ productId }`
- `DELETE /wishlist/items/{productId}` - Remove from wishlist

#### Reviews (Requires ROLE_USER) - **Backend API needed**
- `GET /products/{id}/reviews` - Get product reviews
- `POST /products/{id}/reviews` - Submit review `{ rating, title, comment }`
- `PUT /reviews/{id}` - Edit review
- `DELETE /reviews/{id}` - Delete review

#### Admin - Products (Requires ROLE_ADMIN)
- `POST /admin/products` - Create product
- `PUT /admin/products/{id}` - Update product
- `DELETE /admin/products/{id}` - Delete product

#### Admin - Orders (Requires ROLE_ADMIN)
- `GET /admin/orders` - Get all orders
- `PUT /admin/orders/{id}/status` - Update order status `{ status }`

#### Admin - Users (Requires ROLE_ADMIN)
- `GET /admin/users` - Get all users
- `PUT /admin/users/{id}/status` - Enable/disable user

### Authentication Flow

```javascript
// 1. Login
const response = await authService.login({ email, password })
// Returns: { token: "jwt...", user: {...} }

// 2. Store token in Redux + localStorage (via Redux Persist)
dispatch(setCredentials({ token, user }))

// 3. All subsequent API calls include token via Axios interceptor
// Authorization: Bearer <token>

// 4. On 401 error, auto-logout and redirect to login
```

## MUI Theme Customization

### Color Palette (Classy & Modern)

**Option 1: Deep Navy + Gold**
```javascript
palette: {
  primary: { main: '#1a2332' },      // Deep navy blue
  secondary: { main: '#d4af37' },     // Elegant gold
  background: { default: '#f8f9fa' }
}
```

**Option 2: Emerald + Charcoal**
```javascript
palette: {
  primary: { main: '#047857' },      // Emerald green
  secondary: { main: '#374151' },     // Charcoal gray
  background: { default: '#f9fafb' }
}
```

### Typography
- **Headings:** Montserrat or Poppins (bold, elegant)
- **Body:** Inter or Roboto (clean, readable)

### Custom Component Variants
- Elevated cards with subtle shadows
- Gradient buttons for CTAs
- Smooth transitions and animations
- Responsive spacing system

## Development Guidelines

### Component Structure

```javascript
import React from 'react'
import PropTypes from 'prop-types'
import { Box, Typography } from '@mui/material'

/**
 * ProductCard - Displays a product with image, name, price
 *
 * @param {Object} product - Product object
 * @param {Function} onAddToCart - Add to cart handler
 */
const ProductCard = ({ product, onAddToCart }) => {
  return (
    <Box>
      {/* Component JSX */}
    </Box>
  )
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
}

export default ProductCard
```

### Redux Slice Pattern

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import productService from '@services/productService'

// Async thunk
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await productService.getAll(filters)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Slice
const productsSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = productsSlice.actions
export default productsSlice.reducer
```

### API Service Pattern

```javascript
import api from './api'

const productService = {
  /**
   * Get all products with filters
   * @param {Object} filters - { categoryId, sortBy, q, page, size }
   */
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.categoryId) params.append('categoryId', filters.categoryId)
    if (filters.sortBy) params.append('sortBy', filters.sortBy)
    if (filters.q) params.append('q', filters.q)
    if (filters.page !== undefined) params.append('page', filters.page)
    if (filters.size) params.append('size', filters.size)

    return api.get(`/products?${params.toString()}`)
  },

  getById: async (id) => {
    return api.get(`/products/${id}`)
  },
}

export default productService
```

### Custom Hooks Pattern

```javascript
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, removeFromCart } from '@features/cart/cartSlice'

/**
 * Custom hook for cart operations
 */
export const useCart = () => {
  const dispatch = useDispatch()
  const { items, totalAmount, loading } = useSelector((state) => state.cart)

  const addItem = (productId, quantity) => {
    dispatch(addToCart({ productId, quantity }))
  }

  const removeItem = (productId) => {
    dispatch(removeFromCart(productId))
  }

  return {
    items,
    totalAmount,
    loading,
    addItem,
    removeItem,
  }
}
```

## Routing Structure

```javascript
// App.jsx
<Routes>
  {/* Public Routes */}
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/products" element={<ProductList />} />
  <Route path="/products/:id" element={<ProductDetail />} />

  {/* Protected Routes (ROLE_USER) */}
  <Route element={<PrivateRoute />}>
    <Route path="/cart" element={<Cart />} />
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/orders" element={<OrderHistory />} />
    <Route path="/orders/:id" element={<OrderDetail />} />
    <Route path="/wishlist" element={<Wishlist />} />
    <Route path="/profile" element={<Profile />} />
  </Route>

  {/* Admin Routes (ROLE_ADMIN) */}
  <Route element={<AdminRoute />}>
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/admin/products" element={<ProductManagement />} />
    <Route path="/admin/orders" element={<OrderManagement />} />
    <Route path="/admin/users" element={<UserManagement />} />
  </Route>

  {/* 404 */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

## Feature Implementation Checklist

### Phase 1: Foundation ✅
- [x] Project setup with Vite
- [x] Dependencies installed
- [x] Folder structure created
- [x] Configuration files (Vite, ESLint, Prettier)

### Phase 2: Core Infrastructure 🚧
- [ ] Constants file
- [ ] Axios API service with interceptors
- [ ] MUI theme customization
- [ ] Redux store configuration
- [ ] Utility functions

### Phase 3: Authentication
- [ ] Login page
- [ ] Registration page
- [ ] Auth Redux slice
- [ ] PrivateRoute component
- [ ] AdminRoute component
- [ ] Auto-logout on token expiration

### Phase 4: Layout Components
- [ ] Header with navigation
- [ ] Footer
- [ ] Mobile sidebar/drawer
- [ ] Breadcrumbs

### Phase 5: Product Catalog
- [ ] Product listing page
- [ ] Product card component
- [ ] Product detail page
- [ ] Product filters sidebar
- [ ] Search functionality
- [ ] Pagination
- [ ] Sorting options

### Phase 6: Shopping Cart
- [ ] Cart page
- [ ] Cart item component
- [ ] Mini cart in header
- [ ] Guest cart management
- [ ] Cart merge on login

### Phase 7: Checkout & Orders
- [ ] Checkout page (multi-step)
- [ ] Order history page
- [ ] Order detail page
- [ ] Mock payment flow

### Phase 8: Wishlist Feature
- [ ] Backend API implementation (needed first)
- [ ] Wishlist Redux slice
- [ ] Wishlist page
- [ ] Add/remove wishlist buttons

### Phase 9: Reviews System
- [ ] Backend API implementation (needed first)
- [ ] Reviews Redux slice
- [ ] Review list component
- [ ] Review form component
- [ ] Star rating component

### Phase 10: Product Image Gallery
- [ ] Backend schema update (needed first)
- [ ] Image carousel component
- [ ] Lightbox/zoom functionality

### Phase 11: Admin Panel
- [ ] Admin dashboard
- [ ] Product management (CRUD)
- [ ] Order management
- [ ] User management

### Phase 12: UI/UX Polish
- [ ] Loading skeletons
- [ ] Error boundaries
- [ ] Toast notifications
- [ ] Confirmation dialogs
- [ ] Empty states
- [ ] Responsive design refinements

### Phase 13: Optimization
- [ ] Lazy loading routes
- [ ] Image optimization
- [ ] Code splitting
- [ ] Performance profiling

### Phase 14: Testing & Documentation
- [ ] Basic unit tests
- [ ] Component tests
- [ ] README documentation
- [ ] Deployment guide

## Important Implementation Notes

### Guest Cart Merge Logic

```javascript
// When user logs in:
1. Get guest cart from Redux (persisted in localStorage)
2. Call POST /api/cart/merge with guest cart items
3. Backend merges items (sums quantities if product exists)
4. Clear guest cart, load persistent cart from backend
```

### Protected Routes

```javascript
// PrivateRoute.jsx
const PrivateRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth)
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

// AdminRoute.jsx
const AdminRoute = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const isAdmin = user?.roles?.includes('ROLE_ADMIN')
  return isAuthenticated && isAdmin ? <Outlet /> : <Navigate to="/" replace />
}
```

### Error Handling

```javascript
// Axios interceptor in api.js
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto-logout and redirect to login
      store.dispatch(logout())
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### Notifications

```javascript
import { useSnackbar } from 'notistack'

const { enqueueSnackbar } = useSnackbar()

// Success
enqueueSnackbar('Product added to cart!', { variant: 'success' })

// Error
enqueueSnackbar('Failed to load products', { variant: 'error' })

// Info
enqueueSnackbar('Please login to continue', { variant: 'info' })
```

## Code Standards

### File Naming
- Components: PascalCase (e.g., `ProductCard.jsx`)
- Utilities/Hooks: camelCase (e.g., `useAuth.js`, `formatters.js`)
- Constants: UPPER_SNAKE_CASE in file (e.g., `API_BASE_URL`)

### Import Order
```javascript
// 1. React
import React from 'react'

// 2. External libraries
import { Box, Typography } from '@mui/material'
import { useDispatch } from 'react-redux'

// 3. Internal - Absolute imports using aliases
import Button from '@components/common/Button'
import { fetchProducts } from '@features/products/productsSlice'
import productService from '@services/productService'

// 4. Relative imports
import './styles.css'
```

### PropTypes
Always define PropTypes for component props:
```javascript
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.func,
  prop3: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
}
```

### Comments & Documentation
- Use JSDoc for functions and components
- Explain "why" not "what" in inline comments
- Document complex logic and business rules

## Environment Variables

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=QuickCart

# .env.production
VITE_API_BASE_URL=https://api.quickcart.com/api
VITE_APP_NAME=QuickCart
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

## Performance Best Practices

1. **Memoization:** Use `React.memo`, `useMemo`, `useCallback` for expensive operations
2. **Lazy Loading:** Use `React.lazy` and `Suspense` for route-based code splitting
3. **Debouncing:** Debounce search inputs to reduce API calls
4. **Image Optimization:** Use lazy loading and responsive images
5. **Redux Selectors:** Use memoized selectors with `reselect` if needed

## Accessibility Checklist

- [ ] Semantic HTML elements (`<nav>`, `<main>`, `<article>`)
- [ ] ARIA labels for interactive elements
- [ ] Keyboard navigation support (Tab, Enter, Escape)
- [ ] Focus management for modals and drawers
- [ ] Alt text for images
- [ ] Color contrast ratios (WCAG AA standard)
- [ ] Screen reader friendly notifications

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

## Troubleshooting

### Common Issues

**CORS Errors:**
- Ensure backend CORS is configured for `http://localhost:5173`
- Check Vite proxy configuration in `vite.config.js`

**401 Unauthorized:**
- Token may be expired (default: 24 hours)
- Check if token is being sent in Authorization header
- Verify backend JWT secret matches

**Redux Persist Issues:**
- Clear localStorage if state structure changes
- Check `persistConfig` in store configuration

**MUI Styling Issues:**
- Ensure `@emotion/react` and `@emotion/styled` are installed
- Check theme provider wraps the app

## Additional Resources

- **Backend API Docs:** See `QuickCart_Backend/CLAUDE.md`
- **MUI Documentation:** https://mui.com/
- **Redux Toolkit:** https://redux-toolkit.js.org/
- **React Router:** https://reactrouter.com/
- **Axios:** https://axios-http.com/

## Current Development Status

**Completed:**
- ✅ Project setup and configuration
- ✅ Folder structure
- ✅ Dependencies installed

**In Progress:**
- 🚧 Core infrastructure (Redux, Axios, Theme)

**Next Up:**
- ⏭️ Authentication system
- ⏭️ Product catalog
- ⏭️ Shopping cart

---

**Last Updated:** 2025-11-08
