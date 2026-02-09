import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import { ROUTES } from '@constants'
import LoadingSpinner from '@components/common/LoadingSpinner'

/**
 * AdminRoute Component
 * Protects routes that require admin authentication
 * Redirects to products if not admin
 */
const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner message="Loading..." fullScreen />
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  // Redirect to products if authenticated but not admin
  if (!isAdmin) {
    return <Navigate to={ROUTES.PRODUCTS} replace />
  }

  // Render child routes if authenticated and admin
  return <Outlet />
}

export default AdminRoute
