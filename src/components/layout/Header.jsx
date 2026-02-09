import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Button,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  ShoppingCart,
  FavoriteBorder,
  Menu as MenuIcon,
  Person,
  Logout,
  Dashboard,
} from '@mui/icons-material'
import { useAuth } from '@hooks/useAuth'
import { useCart } from '@hooks/useCart'
import { useWishlist } from '@features/wishlist/useWishlist'
import { useDispatch } from 'react-redux'
import { openSidebar } from '@features/ui/uiSlice'
import MiniCart from './MiniCart'
import { ROUTES } from '@constants'

/**
 * Header Component
 * Main navigation header with logo, cart, user menu
 */
const Header = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const dispatch = useDispatch()

  const { isAuthenticated, user, isAdmin, logout } = useAuth()
  const { itemCount } = useCart()
  const { itemCount: wishlistCount } = useWishlist()

  const [userMenuAnchor, setUserMenuAnchor] = useState(null)
  const [cartAnchor, setCartAnchor] = useState(null)

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null)
  }

  const handleCartOpen = (event) => {
    setCartAnchor(event.currentTarget)
  }

  const handleCartClose = () => {
    setCartAnchor(null)
  }

  const handleLogout = () => {
    handleUserMenuClose()
    logout()
  }

  const handleNavigation = (path) => {
    handleUserMenuClose()
    navigate(path)
  }

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar>
        {/* Mobile Menu Icon */}
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => dispatch(openSidebar())}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Logo */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: { xs: 1, md: 0 },
            fontWeight: 700,
            cursor: 'pointer',
            mr: 4,
          }}
          onClick={() => navigate(ROUTES.PRODUCTS)}
        >
          QuickCart
        </Typography>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              onClick={() => navigate(ROUTES.PRODUCTS)}
            >
              Products
            </Button>
            {isAuthenticated && (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate(ROUTES.ORDERS)}
                >
                  Orders
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate(ROUTES.WISHLIST)}
                >
                  Wishlist
                </Button>
              </>
            )}
            {isAdmin && (
              <Button
                color="inherit"
                onClick={() => navigate(ROUTES.ADMIN.DASHBOARD)}
              >
                Admin
              </Button>
            )}
          </Box>
        )}

        {/* Right Side Icons */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {/* Wishlist Icon */}
          {isAuthenticated && (
            <IconButton
              color="inherit"
              onClick={() => navigate(ROUTES.WISHLIST)}
              aria-label="wishlist"
            >
              <Badge badgeContent={wishlistCount} color="secondary">
                <FavoriteBorder />
              </Badge>
            </IconButton>
          )}

          {/* Cart Icon with MiniCart */}
          <IconButton
            color="inherit"
            onClick={handleCartOpen}
            aria-label="cart"
          >
            <Badge badgeContent={itemCount} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>
          <MiniCart
            anchorEl={cartAnchor}
            open={Boolean(cartAnchor)}
            onClose={handleCartClose}
          />

          {/* User Menu */}
          {isAuthenticated ? (
            <>
              <IconButton
                color="inherit"
                onClick={handleUserMenuOpen}
                aria-label="account"
              >
                <Person />
              </IconButton>
              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary">
                    {user?.firstName} {user?.lastName}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => handleNavigation(ROUTES.PROFILE)}>
                  <Person sx={{ mr: 1 }} fontSize="small" />
                  Profile
                </MenuItem>
                <MenuItem onClick={() => handleNavigation(ROUTES.ORDERS)}>
                  <ShoppingCart sx={{ mr: 1 }} fontSize="small" />
                  My Orders
                </MenuItem>
                {isAdmin && (
                  <MenuItem onClick={() => handleNavigation(ROUTES.ADMIN.DASHBOARD)}>
                    <Dashboard sx={{ mr: 1 }} fontSize="small" />
                    Admin Panel
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} fontSize="small" />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              color="inherit"
              variant="outlined"
              onClick={() => navigate(ROUTES.LOGIN)}
              sx={{ ml: 1 }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
