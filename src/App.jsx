// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import MainLayout from '@components/layout/MainLayout'
import Login from '@features/auth/Login'
import Register from '@features/auth/Register'
import PrivateRoute from '@features/auth/PrivateRoute'
import AdminRoute from '@features/auth/AdminRoute'
import ProductList from '@features/products/ProductList'
import ProductDetail from '@features/products/ProductDetail'
import Cart from '@features/cart/Cart'
import Checkout from '@features/checkout/Checkout'
import Wishlist from '@features/wishlist/Wishlist'
import OrderHistory from '@features/orders/OrderHistory'
import OrderDetail from '@features/orders/OrderDetail'
import AdminDashboard from '@features/admin/AdminDashboard'
import AdminProducts from '@features/admin/AdminProducts'
import AdminOrders from '@features/admin/AdminOrders'
import AdminUsers from '@features/admin/AdminUsers'
import Profile from '@features/profile/Profile'
import { ROUTES } from '@constants'

function App() {
  return (
    <Routes>
      {/* Root Redirect - Default to Products page */}
      <Route path="/" element={<Navigate to={ROUTES.PRODUCTS} replace />} />

      {/* Public Routes - Authentication (No Layout) */}
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />

      {/* Product Routes - Public */}
      <Route
        path={ROUTES.PRODUCTS}
        element={
          <MainLayout>
            <ProductList />
          </MainLayout>
        }
      />
      <Route
        path={`${ROUTES.PRODUCTS}/:id`}
        element={
          <MainLayout>
            <ProductDetail />
          </MainLayout>
        }
      />

      {/* Protected Routes - Require Authentication */}
      <Route element={<PrivateRoute />}>
        <Route
          path={ROUTES.CART}
          element={
            <MainLayout>
              <Cart />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.CHECKOUT}
          element={
            <MainLayout>
              <Checkout />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.WISHLIST}
          element={
            <MainLayout>
              <Wishlist />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.ORDERS}
          element={
            <MainLayout>
              <OrderHistory />
            </MainLayout>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <MainLayout>
              <OrderDetail />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.PROFILE}
          element={
            <MainLayout>
              <Profile />
            </MainLayout>
          }
        />
      </Route>

      {/* Admin Routes - Require ROLE_ADMIN */}
      <Route element={<AdminRoute />}>
        <Route
          path={ROUTES.ADMIN.DASHBOARD}
          element={
            <MainLayout>
              <AdminDashboard />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.ADMIN.PRODUCTS}
          element={
            <MainLayout>
              <AdminProducts />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.ADMIN.ORDERS}
          element={
            <MainLayout>
              <AdminOrders />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.ADMIN.USERS}
          element={
            <MainLayout>
              <AdminUsers />
            </MainLayout>
          }
        />
      </Route>

      {/* 404 Not Found */}
      <Route
        path="*"
        element={
          <MainLayout>
            <Box sx={{ width: '100%', px: 4, py: 4 }}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h4" gutterBottom>
                  404 - Page Not Found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  The page you are looking for does not exist.
                </Typography>
              </Box>
            </Box>
          </MainLayout>
        }
      />
    </Routes>
  )
}

export default App
