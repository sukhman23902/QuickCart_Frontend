import { useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Divider,
  Stack,
} from '@mui/material'
import {
  Person,
  Email,
  CalendarToday,
  ShoppingBag,
  Favorite,
  ShoppingCart,
} from '@mui/icons-material'
import { useAuth } from '@hooks/useAuth'
import LoadingSpinner from '@components/common/LoadingSpinner'
import ProfileAvatar from './ProfileAvatar'
import ProfileInfoRow from './ProfileInfoRow'
import { formatDate } from '@utils/formatters'
import { ROUTES, DATE_FORMATS } from '@constants'

/**
 * Profile Page Component
 * Displays user account information in a read-only format
 */
const Profile = () => {
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()

  // Loading state - redirect handled by PrivateRoute
  if (!user) {
    return <LoadingSpinner message="Loading profile..." />
  }

  const { firstName, lastName, email, createdAt } = user
  const fullName = `${firstName || ''} ${lastName || ''}`.trim() || 'User'

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header Section with Avatar */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <ProfileAvatar firstName={firstName} lastName={lastName} size="large" />
        <Typography variant="h4" fontWeight={700} sx={{ mt: 2, mb: 1 }}>
          {fullName}
        </Typography>
        <Chip
          label={isAdmin ? 'Admin' : 'Member'}
          color={isAdmin ? 'secondary' : 'default'}
          size="small"
          sx={{
            fontWeight: 600,
            px: 1,
          }}
        />
      </Box>

      {/* Account Information Card */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ fontWeight: 600, letterSpacing: 1 }}
        >
          Account Information
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Stack spacing={0}>
          <ProfileInfoRow
            icon={Person}
            label="First Name"
            value={firstName}
          />
          <ProfileInfoRow
            icon={Person}
            label="Last Name"
            value={lastName}
          />
          <ProfileInfoRow
            icon={Email}
            label="Email Address"
            value={email}
          />
          <ProfileInfoRow
            icon={CalendarToday}
            label="Member Since"
            value={createdAt ? formatDate(createdAt, DATE_FORMATS.SHORT) : 'N/A'}
          />
        </Stack>
      </Paper>

      {/* Quick Actions Card */}
      <Paper sx={{ p: 3 }}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ fontWeight: 600, letterSpacing: 1 }}
        >
          Quick Actions
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ mt: 2 }}
        >
          <Button
            variant="outlined"
            startIcon={<ShoppingBag />}
            onClick={() => navigate(ROUTES.ORDERS)}
            fullWidth
            sx={{ justifyContent: 'flex-start', py: 1.5 }}
          >
            View My Orders
          </Button>
          <Button
            variant="outlined"
            startIcon={<Favorite />}
            onClick={() => navigate(ROUTES.WISHLIST)}
            fullWidth
            sx={{ justifyContent: 'flex-start', py: 1.5 }}
          >
            View Wishlist
          </Button>
          <Button
            variant="outlined"
            startIcon={<ShoppingCart />}
            onClick={() => navigate(ROUTES.CART)}
            fullWidth
            sx={{ justifyContent: 'flex-start', py: 1.5 }}
          >
            View Cart
          </Button>
        </Stack>
      </Paper>
    </Container>
  )
}

export default Profile
