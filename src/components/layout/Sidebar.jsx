import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Collapse,
} from '@mui/material'
import {
  ShoppingBag,
  ShoppingCart,
  FavoriteBorder,
  Receipt,
  Dashboard,
  Login,
  Logout,
  Inventory,
  People,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material'
import { closeSidebar, selectSidebarOpen } from '@features/ui/uiSlice'
import { useAuth } from '@hooks/useAuth'
import { ROUTES } from '@constants'

/**
 * Sidebar Component
 * Mobile navigation drawer
 */
const Sidebar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const open = useSelector(selectSidebarOpen)
  const { isAuthenticated, user, isAdmin, logout } = useAuth()
  const [adminMenuOpen, setAdminMenuOpen] = useState(false)

  const handleClose = () => {
    dispatch(closeSidebar())
  }

  const handleNavigation = (path) => {
    navigate(path)
    handleClose()
  }

  const handleLogout = () => {
    logout()
    handleClose()
  }

  const handleAdminMenuToggle = () => {
    setAdminMenuOpen(!adminMenuOpen)
  }

  const menuItems = [
    { label: 'Products', icon: <ShoppingBag />, path: ROUTES.PRODUCTS, public: true },
    { label: 'Cart', icon: <ShoppingCart />, path: ROUTES.CART, public: true },
    { label: 'Wishlist', icon: <FavoriteBorder />, path: ROUTES.WISHLIST, authRequired: true },
    { label: 'Orders', icon: <Receipt />, path: ROUTES.ORDERS, authRequired: true },
  ]

  const adminMenuItems = [
    { label: 'Dashboard', icon: <Dashboard />, path: ROUTES.ADMIN.DASHBOARD },
    { label: 'Products', icon: <Inventory />, path: ROUTES.ADMIN.PRODUCTS },
    { label: 'Orders', icon: <Receipt />, path: ROUTES.ADMIN.ORDERS },
    { label: 'Users', icon: <People />, path: ROUTES.ADMIN.USERS },
  ]

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
        },
      }}
    >
      {/* Logo/Brand */}
      <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" fontWeight={700}>
          QuickCart
        </Typography>
        {isAuthenticated && user && (
          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
            {user.firstName} {user.lastName}
          </Typography>
        )}
      </Box>

      <Divider />

      {/* Menu Items */}
      <List>
        {menuItems.map((item) => {
          // Hide auth-only items if not authenticated
          if (item.authRequired && !isAuthenticated) return null

          return (
            <ListItem key={item.label} disablePadding>
              <ListItemButton onClick={() => handleNavigation(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          )
        })}

        {/* Admin Menu with Sub-items */}
        {isAdmin && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handleAdminMenuToggle}>
                <ListItemIcon>
                  <Dashboard />
                </ListItemIcon>
                <ListItemText primary="Admin Panel" />
                {adminMenuOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            <Collapse in={adminMenuOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {adminMenuItems.map((item) => (
                  <ListItem key={item.label} disablePadding>
                    <ListItemButton
                      onClick={() => handleNavigation(item.path)}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </>
        )}
      </List>

      <Divider />

      {/* Auth Actions */}
      <List>
        {isAuthenticated ? (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        ) : (
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation(ROUTES.LOGIN)}>
              <ListItemIcon>
                <Login />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Drawer>
  )
}

export default Sidebar
