import { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material'
import {
  Search,
  PersonAdd,
} from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAdmin } from './hooks/useAdmin'
import UserStatusToggle from './components/UserStatusToggle'
import EmptyState from '@components/common/EmptyState'
import { formatDate } from '@utils/formatters'
import { useDebounce } from '@hooks/useDebounce'
import { USER_ROLES, DATE_FORMATS, VALIDATION } from '@constants'
import { selectUser } from '@features/auth/authSlice'

/**
 * Validation schema for admin registration
 */
const adminSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('First name is required')
    .max(VALIDATION.NAME.MAX_LENGTH, `Max ${VALIDATION.NAME.MAX_LENGTH} characters`),
  lastName: yup
    .string()
    .required('Last name is required')
    .max(VALIDATION.NAME.MAX_LENGTH, `Max ${VALIDATION.NAME.MAX_LENGTH} characters`),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required')
    .max(VALIDATION.EMAIL.MAX_LENGTH, `Max ${VALIDATION.EMAIL.MAX_LENGTH} characters`),
  password: yup
    .string()
    .required('Password is required')
    .min(VALIDATION.PASSWORD.MIN_LENGTH, `Min ${VALIDATION.PASSWORD.MIN_LENGTH} characters`)
    .max(VALIDATION.PASSWORD.MAX_LENGTH, `Max ${VALIDATION.PASSWORD.MAX_LENGTH} characters`),
})

/**
 * AdminUsers Page
 * User list with status management and admin creation
 */
const AdminUsers = () => {
  const currentUser = useSelector(selectUser)
  const {
    users,
    usersLoading,
    loadUsers,
    updateUserStatus,
    registerAdmin,
  } = useAdmin()

  // Local state
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [adminDialogOpen, setAdminDialogOpen] = useState(false)
  const [adminLoading, setAdminLoading] = useState(false)

  const debouncedSearch = useDebounce(searchQuery, 300)

  // Form for admin registration
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(adminSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  })

  // Load data on mount
  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        !debouncedSearch ||
        user.email?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        user.firstName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(debouncedSearch.toLowerCase())

      const hasRole = (role) => user.roles?.some((r) => r.name === role || r === role)
      const matchesRole =
        !roleFilter ||
        (roleFilter === 'admin' && hasRole(USER_ROLES.ADMIN)) ||
        (roleFilter === 'user' && !hasRole(USER_ROLES.ADMIN))

      return matchesSearch && matchesRole
    })
  }, [users, debouncedSearch, roleFilter])

  // Helpers
  const isAdmin = (user) => {
    return user.roles?.some((r) => r.name === USER_ROLES.ADMIN || r === USER_ROLES.ADMIN)
  }

  const getUserDisplayName = (user) => {
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim()
    }
    return user.email?.split('@')[0] || 'Unknown'
  }

  // Handlers
  const handleOpenAdminDialog = () => {
    reset()
    setAdminDialogOpen(true)
  }

  const handleCloseAdminDialog = () => {
    if (!adminLoading) {
      setAdminDialogOpen(false)
    }
  }

  const handleCreateAdmin = async (data) => {
    setAdminLoading(true)
    try {
      await registerAdmin(data)
      setAdminDialogOpen(false)
    } finally {
      setAdminLoading(false)
    }
  }

  return (
    <Box sx={{ width: '100%', px: 4, py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            User Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage user accounts and permissions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={handleOpenAdminDialog}
        >
          Create Admin
        </Button>
      </Box>

      {/* Filters */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <TextField
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Role</InputLabel>
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            label="Role"
          >
            <MenuItem value="">All Roles</MenuItem>
            <MenuItem value="admin">Admins Only</MenuItem>
            <MenuItem value="user">Users Only</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usersLoading ? (
              [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton width={150} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={200} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={80} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={60} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState
                    variant="search"
                    title={users.length === 0 ? 'No users yet' : 'No users found'}
                    message={
                      users.length === 0
                        ? 'Users will appear here when they register'
                        : 'Try adjusting your search or filter'
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Typography fontWeight={600}>
                      {getUserDisplayName(user)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{user.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={isAdmin(user) ? 'Admin' : 'User'}
                      color={isAdmin(user) ? 'secondary' : 'default'}
                      size="small"
                      variant={isAdmin(user) ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell>
                    <UserStatusToggle
                      userId={user.id}
                      isEnabled={user.isEnabled !== false}
                      onToggle={updateUserStatus}
                      isSelf={currentUser?.id === user.id}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {user.createdAt
                        ? formatDate(user.createdAt, DATE_FORMATS.SHORT)
                        : 'N/A'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Results count */}
      {!usersLoading && filteredUsers.length > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Showing {filteredUsers.length} of {users.length} users
        </Typography>
      )}

      {/* Create Admin Dialog */}
      <Dialog
        open={adminDialogOpen}
        onClose={handleCloseAdminDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Admin</DialogTitle>
        <form onSubmit={handleSubmit(handleCreateAdmin)}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* First Name & Last Name */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="First Name"
                      fullWidth
                      required
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      disabled={adminLoading}
                    />
                  )}
                />
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Last Name"
                      fullWidth
                      required
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                      disabled={adminLoading}
                    />
                  )}
                />
              </Box>

              {/* Email */}
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    disabled={adminLoading}
                  />
                )}
              />

              {/* Password */}
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type="password"
                    fullWidth
                    required
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    disabled={adminLoading}
                  />
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={handleCloseAdminDialog}
              disabled={adminLoading}
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={adminLoading}
              startIcon={
                adminLoading && <CircularProgress size={20} color="inherit" />
              }
            >
              Create Admin
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

export default AdminUsers
