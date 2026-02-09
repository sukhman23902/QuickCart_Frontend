import {useState} from 'react'
import {Link as RouterLink} from 'react-router-dom'
import {
    Box,
    Grid,
    TextField,
    Typography,
    Link,
    InputAdornment,
    IconButton,
    Alert,
} from '@mui/material'
import {Visibility, VisibilityOff, Email, Lock, Person} from '@mui/icons-material'
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {useAuth} from '@hooks/useAuth'
import Button from '@components/common/Button'
import {ROUTES, VALIDATION} from '@constants'

// Validation schema
const schema = yup.object({
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
                                  .email('Enter a valid email')
                                  .required('Email is required')
                                  .max(VALIDATION.EMAIL.MAX_LENGTH, `Max ${VALIDATION.EMAIL.MAX_LENGTH} characters`),
                              password: yup
                                  .string()
                                  .required('Password is required')
                                  .min(VALIDATION.PASSWORD.MIN_LENGTH,
                                       `Min ${VALIDATION.PASSWORD.MIN_LENGTH} characters`)
                                  .max(VALIDATION.PASSWORD.MAX_LENGTH,
                                       `Max ${VALIDATION.PASSWORD.MAX_LENGTH} characters`),
                              confirmPassword: yup
                                  .string()
                                  .required('Please confirm your password')
                                  .oneOf([yup.ref('password')], 'Passwords must match'),
                          })

/**
 * Register Page Component
 * Split design with image on left, form on right
 */
const Register = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const {register: registerUser, loading, error, clearAuthError} = useAuth()

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
                    resolver: yupResolver(schema),
                })

    const onSubmit = async (data) => {
        clearAuthError()
        // eslint-disable-next-line no-unused-vars
        const {confirmPassword: _confirmPassword, ...userData} = data
        try {
            await registerUser(userData)
        } catch (err) {
            // Error is handled by auth hook
        }
    }

    return (
        <Grid container sx={{minHeight: '100vh'}}>
            {/* Left Side - Image */}
            <Grid
                item
                xs={false}
                md={6}
                sx={{
                    display: {xs: 'none', md: 'block'},
                    backgroundImage:
                        'url(https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(26, 35, 50, 0.9) 0%, rgba(26, 35, 50, 0.7) 100%)',
                    },
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        zIndex: 1,
                        color: 'white',
                        p: 8,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="h3" fontWeight={700} gutterBottom>
                        Join QuickCart Today!
                    </Typography>
                    <Typography variant="h6" sx={{opacity: 0.9, maxWidth: 400}}>
                        Create an account and start shopping from our extensive collection of quality products.
                    </Typography>
                </Box>
            </Grid>

            {/* Right Side - Form */}
            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 4,
                    bgcolor: 'background.default',
                    overflowY: 'auto',
                }}
            >
                <Box sx={{maxWidth: 450, width: '100%', py: 4}}>
                    {/* Logo/Brand */}
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        gutterBottom
                        color="primary"
                        sx={{mb: 1}}
                    >
                        QuickCart
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Create your account
                    </Typography>

                    {/* Error Alert */}
                    {error && (
                        <Alert severity="error" sx={{mb: 3}} onClose={clearAuthError}>
                            {error}
                        </Alert>
                    )}

                    {/* Register Form */}
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{mt: 3}}>
                        {/* Name Fields Row */}
                        <Grid container spacing={2} sx={{mb: 3}}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    autoComplete="given-name"
                                    autoFocus
                                    {...register('firstName')}
                                    error={!!errors.firstName}
                                    helperText={errors.firstName?.message}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person color="action"/>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    autoComplete="family-name"
                                    {...register('lastName')}
                                    error={!!errors.lastName}
                                    helperText={errors.lastName?.message}
                                />
                            </Grid>
                        </Grid>

                        {/* Email Field */}
                        <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            autoComplete="email"
                            {...register('email')}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email color="action"/>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{mb: 3}}
                        />

                        {/* Password Field */}
                        <TextField
                            fullWidth
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            {...register('password')}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock color="action"/>
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{mb: 3}}
                        />

                        {/* Confirm Password Field */}
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            {...register('confirmPassword')}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock color="action"/>
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{mb: 3}}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            loading={loading}
                            sx={{mb: 2}}
                        >
                            Create Account
                        </Button>

                        {/* Login Link */}
                        <Box sx={{textAlign: 'center', mt: 3}}>
                            <Typography variant="body2" color="text.secondary">
                                Already have an account?{' '}
                                <Link
                                    component={RouterLink}
                                    to={ROUTES.LOGIN}
                                    fontWeight={600}
                                    underline="hover"
                                >
                                    Sign In
                                </Link>
                            </Typography>
                        </Box>
                    </Box>

                    {/* Divider */}
                    <Box sx={{mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider'}}>
                        <Typography variant="caption" color="text.secondary" align="center" display="block">
                            By creating an account, you agree to our Terms of Service and Privacy Policy
                        </Typography>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )
}

export default Register
