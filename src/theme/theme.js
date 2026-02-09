/**
 * Material-UI Theme Customization
 * Classy, modern design with professional aesthetics
 */

import { createTheme } from '@mui/material/styles'

const palette = {
  primary: {
    main: '#1a2332', // Deep navy blue
    light: '#2d3c52',
    dark: '#0f1821',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#d4af37', // Elegant gold
    light: '#e0c55b',
    dark: '#b8962b',
    contrastText: '#1a2332',
  },
  background: {
    default: '#f8f9fa', // Light gray background
    paper: '#ffffff', // Pure white for cards/papers
  },
  text: {
    primary: '#1a2332', // Dark navy for primary text
    secondary: '#5f6c7b', // Medium gray for secondary text
  },
  success: {
    main: '#10b981', // Emerald green
    light: '#34d399',
    dark: '#059669',
  },
  error: {
    main: '#ef4444', // Red
    light: '#f87171',
    dark: '#dc2626',
  },
  warning: {
    main: '#f59e0b', // Amber
    light: '#fbbf24',
    dark: '#d97706',
  },
  info: {
    main: '#3b82f6', // Blue
    light: '#60a5fa',
    dark: '#2563eb',
  },
  divider: '#e5e7eb',
}


const typography = {
  fontFamily: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),

  h1: {
    fontFamily: 'Montserrat, Inter, sans-serif',
    fontWeight: 700,
    fontSize: '2.5rem',
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
  },

  h2: {
    fontFamily: 'Montserrat, Inter, sans-serif',
    fontWeight: 700,
    fontSize: '2rem',
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
  },

  h3: {
    fontFamily: 'Montserrat, Inter, sans-serif',
    fontWeight: 600,
    fontSize: '1.75rem',
    lineHeight: 1.3,
  },

  h4: {
    fontFamily: 'Montserrat, Inter, sans-serif',
    fontWeight: 600,
    fontSize: '1.5rem',
    lineHeight: 1.4,
  },

  h5: {
    fontFamily: 'Montserrat, Inter, sans-serif',
    fontWeight: 600,
    fontSize: '1.25rem',
    lineHeight: 1.4,
  },

  h6: {
    fontFamily: 'Montserrat, Inter, sans-serif',
    fontWeight: 600,
    fontSize: '1rem',
    lineHeight: 1.4,
  },

  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
  },

  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.6,
  },

  button: {
    fontWeight: 600,
    textTransform: 'none', // Remove uppercase transformation
    letterSpacing: '0.02em',
  },
}

const spacing = 8 // MUI default

const shape = {
  borderRadius: 8, // Slightly rounded for modern aesthetic
}

const components = {
  // Button
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: '10px 24px',
        fontSize: '0.938rem',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
      },
      contained: {
        '&:hover': {
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
        },
      },
      containedPrimary: {
        background: 'linear-gradient(135deg, #1a2332 0%, #2d3c52 100%)',
        '&:hover': {
          background: 'linear-gradient(135deg, #2d3c52 0%, #1a2332 100%)',
        },
      },
      containedSecondary: {
        background: 'linear-gradient(135deg, #d4af37 0%, #e0c55b 100%)',
        '&:hover': {
          background: 'linear-gradient(135deg, #e0c55b 0%, #d4af37 100%)',
        },
      },
      outlined: {
        borderWidth: 1.5,
        '&:hover': {
          borderWidth: 1.5,
        },
      },
    },
  },

  // Card
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          transform: 'translateY(-4px)',
        },
      },
    },
  },

  // Paper
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none', // Remove default gradient
      },
      elevation1: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
      elevation2: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
      elevation3: {
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.12)',
      },
    },
  },

  // AppBar
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
    },
  },

  // TextField
  MuiTextField: {
    defaultProps: {
      variant: 'outlined',
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: palette.primary.light,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderWidth: 2,
        },
      },
    },
  },

  // Chip
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        fontWeight: 500,
      },
    },
  },

  // Badge
  MuiBadge: {
    styleOverrides: {
      badge: {
        fontWeight: 600,
      },
    },
  },

  // Dialog
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 12,
      },
    },
  },

  // Drawer
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRadius: 0,
      },
    },
  },

  // Tooltip
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: palette.primary.main,
        fontSize: '0.813rem',
        fontWeight: 500,
        borderRadius: 6,
        padding: '8px 12px',
      },
      arrow: {
        color: palette.primary.main,
      },
    },
  },

  // Table
  MuiTableHead: {
    styleOverrides: {
      root: {
        '& .MuiTableCell-head': {
          fontWeight: 600,
          backgroundColor: palette.background.default,
          color: palette.text.primary,
        },
      },
    },
  },

  MuiTableRow: {
    styleOverrides: {
      root: {
        '&:hover': {
          backgroundColor: '#f9fafb',
        },
      },
    },
  },

  // Pagination
  MuiPaginationItem: {
    styleOverrides: {
      root: {
        fontWeight: 500,
      },
    },
  },
}

const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
}

const theme = createTheme({
  palette,
  typography,
  spacing,
  shape,
  components,
  breakpoints,
})

export default theme
