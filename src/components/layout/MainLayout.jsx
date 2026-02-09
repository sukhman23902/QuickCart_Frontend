import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'
import ErrorBoundary from '@components/common/ErrorBoundary'

/**
 * MainLayout Component
 * Main application layout with header, footer, and sidebar
 *
 * @param {ReactNode} children - Page content
 */
const MainLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />
      <Sidebar />

      <Box
        component="main"
        sx={{
          flex: 1,
          bgcolor: 'background.default',
        }}
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </Box>

      <Footer />
    </Box>
  )
}

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default MainLayout
