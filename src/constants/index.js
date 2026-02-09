export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
  },

  // Products
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id) => `/products/${id}`,
  },

  // Categories
  CATEGORIES: {
    BASE: '/categories',
    BY_ID: (id) => `/categories/${id}`,
  },

  // Cart
  CART: {
    BASE: '/cart',
    ITEMS: '/cart/items',
    REMOVE_ITEM: (productId) => `/cart/items/${productId}`,
    MERGE: '/cart/merge',
  },

  // Orders
  ORDERS: {
    BASE: '/orders',
    BY_ID: (id) => `/orders/${id}`,
  },

  // Wishlist (Backend API to be implemented)
  WISHLIST: {
    BASE: '/wishlist',
    ITEMS: '/wishlist/items',
    REMOVE_ITEM: (productId) => `/wishlist/items/${productId}`,
  },

  // Admin - Products
  ADMIN: {
    PRODUCTS: {
      BASE: '/admin/products',
      BY_ID: (id) => `/admin/products/${id}`,
    },
    // Admin - Orders
    ORDERS: {
      BASE: '/admin/orders',
      UPDATE_STATUS: (id) => `/admin/orders/${id}/status`,
    },
    // Admin - Users
    USERS: {
      BASE: '/admin/users',
      BY_ID: (id) => `/admin/users/${id}`,
      UPDATE_STATUS: (id) => `/admin/users/${id}/status`,
      REGISTER_ADMIN: '/admin/users/register-admin',
    },
  },
}

// ==================== ORDER STATUS ====================

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
}

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Pending',
  [ORDER_STATUS.SHIPPED]: 'Shipped',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
}

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: 'warning',
  [ORDER_STATUS.SHIPPED]: 'info',
  [ORDER_STATUS.DELIVERED]: 'success',
  [ORDER_STATUS.CANCELLED]: 'error',
}

// ==================== USER ROLES ====================

export const USER_ROLES = {
  USER: 'ROLE_USER',
  ADMIN: 'ROLE_ADMIN',
}

// ==================== SORT OPTIONS ====================

export const SORT_OPTIONS = {
  PRICE_LOW_HIGH: 'price,asc',
  PRICE_HIGH_LOW: 'price,desc',
  NAME_A_Z: 'name,asc',
  NAME_Z_A: 'name,desc',
  NEWEST: 'createdAt,desc',
}

// ==================== PAGINATION ====================

export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 12,
  SIZE_OPTIONS: [12, 24, 48],
}

// ==================== PRODUCT FILTERS ====================

export const FILTER_DEFAULTS = {
  categoryId: null,
  searchQuery: '',
  sortBy: SORT_OPTIONS.NEWEST,
  inStock: false,
  page: PAGINATION.DEFAULT_PAGE,
  size: PAGINATION.DEFAULT_SIZE,
}

// ==================== VALIDATION RULES ====================

export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 100,
  },
  EMAIL: {
    MAX_LENGTH: 100,
  },
  NAME: {
    MAX_LENGTH: 50,
  },
  PRODUCT: {
    NAME_MAX_LENGTH: 100,
    IMAGE_URL_MAX_LENGTH: 255,
  },
}

// ==================== NOTIFICATION MESSAGES ====================

export const MESSAGES = {
  // Success
  SUCCESS: {
    LOGIN: 'Welcome back!',
    REGISTER: 'Account created successfully!',
    LOGOUT: 'Logged out successfully',
    ADD_TO_CART: 'Added to cart',
    REMOVE_FROM_CART: 'Removed from cart',
    ADD_TO_WISHLIST: 'Added to wishlist',
    REMOVE_FROM_WISHLIST: 'Removed from wishlist',
    ORDER_PLACED: 'Order placed successfully!',
    PRODUCT_CREATED: 'Product created successfully',
    PRODUCT_UPDATED: 'Product updated successfully',
    PRODUCT_DELETED: 'Product deleted successfully',
    ORDER_STATUS_UPDATED: 'Order status updated',
    USER_STATUS_UPDATED: 'User status updated',
  },

  // Error
  ERROR: {
    GENERIC: 'Something went wrong. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'Please login to continue',
    FORBIDDEN: 'You do not have permission to perform this action',
    NOT_FOUND: 'Resource not found',
    VALIDATION: 'Please check your input and try again',
    LOGIN_FAILED: 'Invalid email or password',
    REGISTER_FAILED: 'Registration failed. Email may already exist.',
    FETCH_PRODUCTS_FAILED: 'Failed to load products',
    FETCH_CART_FAILED: 'Failed to load cart',
    FETCH_ORDERS_FAILED: 'Failed to load orders',
    OUT_OF_STOCK: 'Product is out of stock',
    INSUFFICIENT_STOCK: 'Insufficient stock available',
  },

  // Info
  INFO: {
    EMPTY_CART: 'Your cart is empty',
    EMPTY_WISHLIST: 'Your wishlist is empty',
    NO_ORDERS: 'You have no orders yet',
    NO_PRODUCTS: 'No products found',
  },
}

// ==================== ROUTES ====================

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id) => `/products/${id}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: (id) => `/orders/${id}`,
  WISHLIST: '/wishlist',
  PROFILE: '/profile',
  ADMIN: {
    DASHBOARD: '/admin',
    PRODUCTS: '/admin/products',
    ORDERS: '/admin/orders',
    USERS: '/admin/users',
  },
  NOT_FOUND: '*',
}

// ==================== IMAGE PLACEHOLDER ====================

export const PLACEHOLDER_IMAGE =
  'https://placehold.co/300x300?text=No+Image'

// ==================== CURRENCY ====================

export const CURRENCY = {
  CODE: 'INR',
  SYMBOL: '₹',
}

// ==================== DATE FORMATS ====================

export const DATE_FORMATS = {
  FULL: 'MMMM dd, yyyy HH:mm',
  SHORT: 'MMM dd, yyyy',
  TIME: 'HH:mm',
}

// ==================== API TIMEOUT ====================

export const API_TIMEOUT = 30000 // 30 seconds

// ==================== ADMIN STATS REFRESH ====================

export const ADMIN_REFRESH_INTERVAL = 60000 // 60 seconds
