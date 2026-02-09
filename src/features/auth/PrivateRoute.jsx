import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import { ROUTES } from '@constants'
import LoadingSpinner from '@components/common/LoadingSpinner'

/**
 * PrivateRoute Component
 * Protects routes that require authentication
 * Redirects to login if not authenticated
 */
const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth()

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner message="Loading..." fullScreen />
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  // Render child routes if authenticated
  return <Outlet />
}

export default PrivateRoute
