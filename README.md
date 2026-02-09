# QuickCart Frontend

Modern, classy e-commerce web application built with React 18, Redux Toolkit, and Material-UI.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Tech Stack

- **React 18** - Modern React with hooks
- **Redux Toolkit** - State management
- **Redux Persist** - Persist cart and auth state
- **Material-UI v5** - Component library with custom theme
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with JWT interceptors
- **React Hook Form + Yup** - Form handling and validation
- **Vite** - Fast build tool
- **Notistack** - Toast notifications

## 🏗️ Project Structure

```
src/
├── app/                 # Redux store configuration
├── features/            # Feature modules (auth, products, cart, etc.)
├── components/          # Shared components
├── services/            # API service layer
├── utils/               # Utility functions
├── constants/           # App constants
├── theme/               # MUI theme customization
└── assets/              # Static assets
```

## ✅ Completed Setup

### Phase 1: Foundation
- [x] React app with Vite
- [x] All dependencies installed
- [x] Folder structure created
- [x] ESLint + Prettier configured

### Phase 2: Core Infrastructure
- [x] Constants file (API endpoints, app constants)
- [x] Axios service with JWT interceptors
- [x] Custom MUI theme (Deep Navy + Gold)
- [x] Redux store with Redux Persist
- [x] Utility functions (formatters, validators, helpers)
- [x] Main app integrated with all providers

## 🎨 Design System

**Color Palette:**
- Primary: Deep Navy Blue (#1a2332)
- Secondary: Elegant Gold (#d4af37)
- Background: Light Gray (#f8f9fa)

**Typography:**
- Headings: Montserrat (bold, elegant)
- Body: Inter (clean, readable)

**Features:**
- Elevated cards with smooth hover effects
- Gradient buttons for CTAs
- Responsive, mobile-first design
- Professional, classy aesthetic

## 📚 Documentation

See `CLAUDE.md` for comprehensive development guidelines, architecture details, and implementation plan.

## 🔗 Backend Integration

The frontend integrates with a Spring Boot backend running at `http://localhost:8080/api`.

Ensure the backend is running before starting the frontend.

## 🌐 Environment Variables

Create `.env.development` and `.env.production` files:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=QuickCart
```

## 📋 Next Steps

1. **Authentication System** - Login, Register, Protected Routes
2. **Product Catalog** - Product listing, filters, search, detail pages
3. **Shopping Cart** - Cart management, guest cart, merge logic
4. **Checkout & Orders** - Multi-step checkout, order history
5. **Wishlist** - Save favorite products
6. **Reviews** - Product reviews and ratings
7. **Admin Panel** - Product, order, and user management

## 🧪 Testing

```bash
# Run tests
npm run test
```

## 📝 Code Standards

- Use PropTypes for component props
- Follow ESLint and Prettier rules
- Write JSDoc comments for functions
- Use absolute imports with aliases (@components, @services, etc.)

## 🤝 Contributing

1. Follow the established folder structure
2. Use Redux Toolkit for state management
3. Use MUI components for UI
4. Write clean, documented code

## 📄 License

Private project

---

**Last Updated:** 2025-11-08
