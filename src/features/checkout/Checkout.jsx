// eslint-disable-next-line no-unused-vars
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { ROUTES } from '@constants'

const Checkout = () => {
  const navigate = useNavigate()

  const handleBackToCart = () => {
    navigate(ROUTES.CART)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        px: 2,
      }}
    >
      <Box
        component="img"
        src="https://i.ibb.co/4RyFbxxS/checkout-page-not-found.png"
        alt="Checkout Not Available"
        sx={{
          width: '100%',
          maxWidth: 800,
          height: 'auto',
          borderRadius: 4,
          mb: 4,
        }}
      />

      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<ArrowBackIcon />}
        onClick={handleBackToCart}
        sx={{ px: 4, py: 1.5 }}
      >
        Back to Cart
      </Button>
    </Box>
  )
}

export default Checkout
