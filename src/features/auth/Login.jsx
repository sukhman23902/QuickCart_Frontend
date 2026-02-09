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
import {Visibility, VisibilityOff, Email, Lock} from '@mui/icons-material'
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {useAuth} from '@hooks/useAuth'
import Button from '@components/common/Button'
import {ROUTES} from '@constants'

// Validation schema
const schema = yup.object({
                              email: yup
                                  .string()
                                  .email('Enter a valid email')
                                  .required('Email is required'),
                              password: yup.string().required('Password is required'),
                          })

/**
 * Login Page Component
 * Split design with image on left, form on right
 */
const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const {login, loading, error, clearAuthError} = useAuth()

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
                    resolver: yupResolver(schema),
                })

    const onSubmit = async (data) => {
        clearAuthError()
        try {
            await login(data)
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
                        'url(https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070)',
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
                        Welcome Back!
                    </Typography>
                    <Typography variant="h6" sx={{opacity: 0.9, maxWidth: 400}}>
                        Sign in to continue your shopping journey and explore amazing products.
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
                }}
            >
                <Box sx={{maxWidth: 450, width: '100%'}}>
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
                        Sign in to your account
                    </Typography>

                    {/* Error Alert */}
                    {error && (
                        <Alert severity="error" sx={{mb: 3}} onClose={clearAuthError}>
                            {error}
                        </Alert>
                    )}

                    {/* Login Form */}
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{mt: 3}}>
                        {/* Email Field */}
                        <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            autoComplete="email"
                            autoFocus
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
                            autoComplete="current-password"
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
                            sx={{mb: 2}}
                        />

                        {/* Forgot Password Link */}
                        <Box sx={{textAlign: 'right', mb: 3}}>
                            <Link
                                component={RouterLink}
                                to="/forgot-password"
                                variant="body2"
                                underline="hover"
                            >
                                Forgot password?
                            </Link>
                        </Box>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            loading={loading}
                            sx={{mb: 2}}
                        >
                            Sign In
                        </Button>

                        {/* Register Link */}
                        <Box sx={{textAlign: 'center', mt: 3}}>
                            <Typography variant="body2" color="text.secondary">
                                Don&apos;t have an account?{' '}
                                <Link
                                    component={RouterLink}
                                    to={ROUTES.REGISTER}
                                    fontWeight={600}
                                    underline="hover"
                                >
                                    Sign Up
                                </Link>
                            </Typography>
                        </Box>
                    </Box>

                    {/* Divider */}
                    <Box sx={{mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider'}}>
                        <Typography variant="caption" color="text.secondary" align="center" display="block">
                            By signing in, you agree to our Terms of Service and Privacy Policy
                        </Typography>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )
}

export default Login
