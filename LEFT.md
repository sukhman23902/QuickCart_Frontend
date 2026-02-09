# QuickCart Frontend - Remaining Features

**Last Updated:** 2025-11-09
**Remaining Work:** ~40%

This document outlines all features that still need to be implemented to complete the QuickCart e-commerce application.

---

## ✅ RECENTLY COMPLETED

### ~~1. Shopping Cart Pages~~ (100% Complete) ✅

**Status:** ✅ **COMPLETED** - All cart UI components fully implemented

**Implemented Components:**
- ✅ **Cart.jsx** - Full-page cart view with summary, tax, shipping calculations
- ✅ **CartItem.jsx** - Individual cart item with quantity controls (full & compact modes)
- ✅ **MiniCart.jsx** - Header dropdown/drawer showing recent cart items
- ✅ **Header integration** - MiniCart opens on cart icon click
- ✅ **Route added** - `/cart` protected route configured

See `PROGRESS.md` Section 12 for full details.

---

## 🔴 HIGH PRIORITY - Core E-commerce Features

These features are essential for a functional e-commerce application and should be implemented first.

### 1. Checkout & Orders Pages (0% Complete)

**Status:** ❌ Redux slice and service exist, but NO UI components

**Missing Components:**

#### Checkout.jsx (Multi-Step Checkout)
**File:** `src/features/orders/Checkout.jsx` (DOES NOT EXIST)

**Required Features:**

**Step 1: Shipping Information**
- First name, last name
- Street address
- City, state, ZIP code
- Phone number
- Form validation

**Step 2: Payment Method**
- Payment method selection (Credit Card, Debit Card, PayPal, etc.)
- Mock payment form (for demo purposes)
- Card number, expiry, CVV fields (non-functional, just UI)
- Billing address (same as shipping checkbox)

**Step 3: Order Review**
- Order summary
- Shipping address display
- Payment method display
- Order items list
- Total breakdown (subtotal, shipping, tax, total)
- "Place Order" button
- Terms & conditions checkbox

**Additional Features:**
- Step indicator (progress bar/stepper)
- Back/Next navigation
- Form data persistence between steps
- Loading state during order creation
- Success redirect to order confirmation
- Error handling

**Estimated Complexity:** High
**Dependencies:**
- useCart hook (✅ exists)
- createOrder thunk (✅ exists)
- Stepper component (MUI Stepper)

---

#### OrderHistory.jsx (Order List Page)
**File:** `src/features/orders/OrderHistory.jsx` (DOES NOT EXIST)

**Required Features:**
- List of user's past orders
- Order cards showing:
  - Order number
  - Order date
  - Order status (Pending, Shipped, Delivered, Cancelled)
  - Total amount
  - Number of items
  - "View Details" button
- Sort by date (newest first)
- Filter by status
- Empty state (no orders yet)
- Loading skeleton
- Error handling
- Pagination (if many orders)

**Estimated Complexity:** Medium
**Dependencies:**
- fetchOrders thunk (✅ exists)
- OrderCard component (need to create)

---

#### OrderDetail.jsx (Single Order Page)
**File:** `src/features/orders/OrderDetail.jsx` (DOES NOT EXIST)

**Required Features:**
- Order information:
  - Order number
  - Order date
  - Order status with visual indicator
  - Estimated delivery date
- Shipping address display
- Payment method used
- Order items list with:
  - Product image
  - Product name
  - Quantity
  - Price at purchase
  - Subtotal
- Order total breakdown
- "Track Order" button (mock)
- "Reorder" button (add all items to cart)
- "Cancel Order" button (if status = Pending)
- Print receipt button
- Back to orders link

**Estimated Complexity:** Medium
**Dependencies:**
- fetchOrderById thunk (✅ exists)
- Order status constants (✅ exists)

---

**Routes to Add:**
```javascript
// In App.jsx
<Route element={<PrivateRoute />}>
  <Route path="/checkout" element={<Checkout />} />
  <Route path="/orders" element={<OrderHistory />} />
  <Route path="/orders/:id" element={<OrderDetail />} />
</Route>
```

**Backend APIs:** ✅ All order APIs already exist

---

### 2. Profile/Account Settings Page (0% Complete)

**Status:** ❌ Route placeholder exists, but no actual page

#### Profile.jsx (User Profile Page)
**File:** `src/features/auth/Profile.jsx` (DOES NOT EXIST)

**Required Features:**

**Personal Information Section:**
- Display current user info (first name, last name, email)
- Edit profile button
- Edit mode with form
- Update profile functionality
- Change password section

**Address Book:**
- List of saved addresses
- Add new address
- Edit/delete addresses
- Set default shipping address

**Account Settings:**
- Email preferences (marketing, order updates)
- Notification settings
- Language preference
- Currency preference

**Account Actions:**
- Delete account button (with confirmation)
- Logout button

**Estimated Complexity:** Medium
**Dependencies:**
- Update user profile API (❌ NOT implemented in backend)
- Address management APIs (❌ NOT implemented in backend)

**Note:** Backend APIs need to be created first

---

### 3. Enhanced Homepage (20% Complete)

**Status:** ⚠️ Basic welcome screen exists, needs major enhancements

**Current State:** `src/App.jsx` has basic welcome message

#### HomePage.jsx (Landing Page)
**File:** `src/pages/HomePage.jsx` or `src/features/home/HomePage.jsx` (DOES NOT EXIST)

**Required Sections:**

**Hero Section:**
- Large banner with promotional message
- "Shop Now" CTA button
- Background image or carousel

**Featured Products:**
- 4-8 featured products in grid
- Use ProductCard component (✅ exists)
- "View All Products" link

**Category Highlights:**
- Grid of category cards with images
- Click to filter products by category

**Promotional Banners:**
- 2-3 promotional sections
- Deals, discounts, new arrivals

**Why Shop With Us:**
- Free shipping, easy returns, secure payment icons
- Trust badges

**Newsletter Signup:**
- Email input
- Subscribe button
- Success message

**Estimated Complexity:** Medium
**Dependencies:**
- ProductCard (✅ exists)
- fetchProducts (✅ exists)
- Category data (✅ exists)

---

## 🟡 MEDIUM PRIORITY - Enhanced Features

These features improve user experience but aren't critical for basic functionality.

### 5. Wishlist Page (0% Complete)

**Status:** ❌ Redux slice and service exist, backend API needed

#### Wishlist.jsx (Wishlist Page)
**File:** `src/features/wishlist/Wishlist.jsx` (DOES NOT EXIST)

**Required Features:**
- Grid of wishlist products
- Use ProductCard component with "Remove from Wishlist" action
- "Add All to Cart" button
- "Clear Wishlist" button
- Empty wishlist state
- Loading state
- Error handling
- Share wishlist button (future feature)

**Estimated Complexity:** Low-Medium
**Dependencies:**
- Wishlist slice (✅ exists)
- Wishlist service (✅ exists)
- **Backend API (❌ NOT implemented)**

**Backend Needed:**
```java
// WishlistController.java
GET /api/wishlist
POST /api/wishlist/items
DELETE /api/wishlist/items/{productId}
```

**Routes to Add:**
```javascript
<Route element={<PrivateRoute />}>
  <Route path="/wishlist" element={<Wishlist />} />
</Route>
```

---

### 6. Product Reviews Components (0% Complete)

**Status:** ❌ Redux slice and service exist, backend API needed

**Missing Components:**

#### ReviewList.jsx (Product Reviews Display)
**File:** `src/features/reviews/ReviewList.jsx` (DOES NOT EXIST)

**Required Features:**
- List of reviews for a product
- Each review shows:
  - Star rating (1-5 stars)
  - Review title
  - Review text
  - Reviewer name
  - Review date
  - Helpful/Not Helpful buttons
- Average rating display
- Rating distribution chart (5 stars: X%, 4 stars: Y%, etc.)
- Sort by: Most Recent, Highest Rated, Lowest Rated
- Pagination
- Empty state (no reviews yet)

**Estimated Complexity:** Medium
**Integration:** Add to ProductDetail.jsx page

---

#### ReviewForm.jsx (Submit/Edit Review)
**File:** `src/features/reviews/ReviewForm.jsx` (DOES NOT EXIST)

**Required Features:**
- Star rating selector
- Review title input
- Review text textarea
- Form validation
- Submit button
- Loading state
- Success message
- Error handling
- Edit mode (pre-fill with existing review)
- Delete button (for user's own reviews)

**Estimated Complexity:** Low-Medium
**Integration:** Show as modal or section in ProductDetail page

---

**Star Rating Component:**
**File:** `src/components/common/StarRating.jsx` (DOES NOT EXIST)

**Required Features:**
- Display star rating (read-only or interactive)
- Support half-stars
- Customizable size and color
- Hover state for selection

**Estimated Complexity:** Low

---

**Dependencies:**
- Reviews slice (✅ exists)
- Review service (✅ exists)
- **Backend API (❌ NOT implemented)**

**Backend Needed:**
```java
// ReviewController.java
GET /api/products/{id}/reviews
POST /api/products/{id}/reviews
PUT /api/reviews/{id}
DELETE /api/reviews/{id}
```

---

### 7. Admin Panel (0% Complete)

**Status:** ❌ Admin service exists, but NO UI components

**Missing Components:**

#### AdminDashboard.jsx (Admin Overview)
**File:** `src/features/admin/AdminDashboard.jsx` (DOES NOT EXIST)

**Required Features:**
- Statistics cards:
  - Total revenue
  - Total orders
  - Total products
  - Total users
- Recent orders list (latest 10)
- Low stock alerts
- Charts:
  - Revenue over time (line chart)
  - Orders by status (pie chart)
  - Top selling products
- Quick actions:
  - Add new product
  - View all orders
  - View all users

**Estimated Complexity:** High
**Dependencies:**
- Admin service (✅ exists)
- Chart library (need to install: recharts or chart.js)

---

#### ProductManagement.jsx (Admin Product CRUD)
**File:** `src/features/admin/ProductManagement.jsx` (DOES NOT EXIST)

**Required Features:**
- Product list table with:
  - Product image
  - Name
  - Category
  - Price
  - Stock quantity
  - Actions (Edit, Delete)
- Search products
- Filter by category
- "Add New Product" button
- Edit product modal/page with form:
  - Name, description, price, stock, category, image URL
  - Form validation
  - Update button
- Delete product with confirmation
- Pagination
- Loading states
- Success/error messages

**Estimated Complexity:** Medium-High
**Dependencies:**
- Admin service (✅ exists)
- All product APIs exist (✅)

---

#### OrderManagement.jsx (Admin Order Management)
**File:** `src/features/admin/OrderManagement.jsx` (DOES NOT EXIST)

**Required Features:**
- Orders list table with:
  - Order ID
  - Customer name
  - Order date
  - Status
  - Total amount
  - Actions (View Details, Update Status)
- Filter by status
- Search by order ID or customer name
- Update order status dropdown (Pending → Shipped → Delivered)
- View order details modal
- Pagination
- Export orders to CSV

**Estimated Complexity:** Medium
**Dependencies:**
- Admin service (✅ exists)
- getAllOrders, updateOrderStatus APIs (✅ exist)

---

#### UserManagement.jsx (Admin User Management)
**File:** `src/features/admin/UserManagement.jsx` (DOES NOT EXIST)

**Required Features:**
- Users list table with:
  - User ID
  - Name
  - Email
  - Roles
  - Account status (Enabled/Disabled)
  - Registration date
  - Actions (View Details, Enable/Disable, Delete)
- Search users
- Filter by role
- Enable/disable user accounts
- View user details modal (orders, profile info)
- Pagination

**Estimated Complexity:** Medium
**Dependencies:**
- Admin service (✅ exists)
- getAllUsers, updateUserStatus APIs (✅ exist)

---

**Routes to Add:**
```javascript
<Route element={<AdminRoute />}>
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/admin/products" element={<ProductManagement />} />
  <Route path="/admin/orders" element={<OrderManagement />} />
  <Route path="/admin/users" element={<UserManagement />} />
</Route>
```

**Backend APIs:** ✅ All admin APIs already exist in adminService.js

---

## 🟢 LOW PRIORITY - Polish & Optimization

These features add polish and improve performance but can be done later.

### 8. Product Image Gallery (0% Complete)

**Status:** ❌ Not implemented, backend schema update needed

**Current State:** ProductDetail shows only single image

#### ImageCarousel Component
**File:** `src/components/common/ImageCarousel.jsx` (DOES NOT EXIST)

**Required Features:**
- Multiple product images carousel
- Thumbnail navigation
- Next/Previous buttons
- Zoom on hover
- Lightbox/fullscreen view
- Touch/swipe support for mobile

**Estimated Complexity:** Medium
**Dependencies:**
- **Backend schema update needed** (Product entity needs `images` array field)
- Image carousel library (e.g., react-slick, swiper)

**Backend Changes Needed:**
```java
// Product.java entity
@ElementCollection
private List<String> imageUrls; // Multiple images instead of single imageUrl
```

---

### 9. Additional Missing Components

#### Breadcrumbs Component
**File:** `src/components/layout/Breadcrumbs.jsx` (DOES NOT EXIST)

**Required Features:**
- Dynamic breadcrumb navigation
- Home > Category > Product
- Clickable links
- Current page indicator

**Estimated Complexity:** Low
**Integration:** Add to ProductDetail, Category pages

---

#### Toast Notifications Integration
**Status:** ⚠️ Notistack installed but not fully integrated

**What's Needed:**
- Ensure SnackbarProvider wraps app (✅ done in main.jsx)
- Use enqueueSnackbar in all user actions:
  - Add to cart success
  - Order placed success
  - Error messages
  - Login/logout notifications
  - Profile updated success

**Estimated Complexity:** Low
**Work:** Add notification calls throughout the app

---

### 10. Route Lazy Loading

**Status:** ❌ Not implemented

**What's Needed:**
- Lazy load route components with React.lazy() and Suspense
- Code splitting for better performance
- Loading fallback during route transitions

**Example:**
```javascript
const ProductList = lazy(() => import('@features/products/ProductList'))
const Cart = lazy(() => import('@features/cart/Cart'))

<Route path="/products" element={
  <Suspense fallback={<LoadingSpinner fullScreen />}>
    <ProductList />
  </Suspense>
} />
```

**Estimated Complexity:** Low
**Benefit:** Reduces initial bundle size

---

### 11. Testing & Documentation (0% Complete)

**Status:** ❌ Not started

**What's Needed:**

**Unit Tests:**
- Utility function tests (formatters, validators, helpers)
- Redux slice tests (actions, reducers, selectors)
- Custom hook tests

**Component Tests:**
- ProductCard, CartItem, Button component tests
- Auth form validation tests
- Cart operations tests

**Integration Tests:**
- Login → Add to cart → Checkout flow
- Product filtering flow
- Admin CRUD operations

**Documentation:**
- Update README with:
  - Complete setup instructions
  - Environment variables documentation
  - API integration guide
  - Development workflow
  - Deployment instructions

**Estimated Complexity:** High
**Tools Needed:** Vitest, React Testing Library

---

## 📋 Implementation Priority Roadmap

### Phase 1: Essential E-commerce (Weeks 1-2)
1. ✅ Cart page + CartItem + MiniCart
2. ✅ Checkout page (multi-step)
3. ✅ Order History + Order Detail pages
4. ✅ Enhanced Homepage with featured products

**Goal:** Fully functional shopping experience

---

### Phase 2: User Features (Week 3)
1. ✅ Profile/Account settings page
2. ✅ Wishlist page (after backend API)
3. ✅ Review components (after backend API)
4. ✅ Toast notifications integration

**Goal:** Complete user account management

---

### Phase 3: Admin Panel (Week 4)
1. ✅ Admin Dashboard
2. ✅ Product Management
3. ✅ Order Management
4. ✅ User Management

**Goal:** Complete admin functionality

---

### Phase 4: Polish & Optimization (Week 5)
1. ✅ Product image gallery (after backend update)
2. ✅ Breadcrumbs component
3. ✅ Route lazy loading
4. ✅ Performance optimization
5. ✅ Responsive design refinements

**Goal:** Production-ready application

---

### Phase 5: Testing & Deployment (Week 6)
1. ✅ Unit tests
2. ✅ Component tests
3. ✅ Integration tests
4. ✅ Documentation
5. ✅ Deployment setup

**Goal:** Tested and deployed application

---

## 🔧 Backend Dependencies

**Features Requiring Backend API Implementation:**

1. **Wishlist System**
   - `GET /api/wishlist`
   - `POST /api/wishlist/items`
   - `DELETE /api/wishlist/items/{productId}`
   - Backend entities: Wishlist, WishlistItem

2. **Reviews System**
   - `GET /api/products/{id}/reviews`
   - `POST /api/products/{id}/reviews`
   - `PUT /api/reviews/{id}`
   - `DELETE /api/reviews/{id}`
   - Backend entities: Review

3. **Profile Management**
   - `PUT /api/users/profile`
   - `PUT /api/users/password`
   - `POST /api/users/addresses`
   - `PUT /api/users/addresses/{id}`
   - `DELETE /api/users/addresses/{id}`
   - Backend entities: Address

4. **Product Image Gallery**
   - Update Product entity schema to support multiple images
   - Image upload functionality (optional, can use URLs)

---

## 📊 Summary

**Total Missing Features:** 22+ (down from 25+)

**High Priority (Core E-commerce):** 7 features (3 completed ✅)
- ~~Cart page, CartItem, MiniCart~~ ✅ COMPLETED
- Checkout page
- Order History, Order Detail
- Profile page
- Enhanced Homepage

**Medium Priority (Enhanced UX):** 8 features
- Wishlist page
- Review components (ReviewList, ReviewForm, StarRating)
- Admin Dashboard
- Product/Order/User Management

**Low Priority (Polish):** 7+ features
- Image gallery
- Breadcrumbs
- Lazy loading
- Testing
- Documentation

**Estimated Time to Complete:** 4-5 weeks (for one developer)

---

**Last Updated:** 2025-11-09
**See Also:** PROGRESS.md for completed features
